import { useEffect } from "react";
import { courses } from "../data/site";
type Context = {
  registerTool: (
    tool: {
      name: string;
      title: string;
      description: string;
      inputSchema: object;
      annotations: object;
      execute: (input: unknown) => unknown;
    },
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};
export default function AgentTools() {
  useEffect(() => {
    const context = (document as Document & { modelContext?: Context })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(
        context.registerTool(
          {
            name: "read_course_curriculum",
            title: "Read a course curriculum",
            description:
              "Read the same course curriculum, prerequisites and project shown on CloudByteLabs. This does not enrol a learner or submit an enquiry.",
            inputSchema: {
              type: "object",
              properties: {
                slug: { type: "string", enum: courses.map((c) => c.slug) },
              },
              required: ["slug"],
              additionalProperties: false,
            },
            annotations: { readOnlyHint: true, untrustedContentHint: false },
            execute(input) {
              if (
                !input ||
                typeof input !== "object" ||
                !("slug" in input) ||
                typeof input.slug !== "string"
              )
                throw new Error("A valid course slug is required.");
              const course = courses.find((c) => c.slug === input.slug);
              if (!course) throw new Error("Course not found.");
              return { ...course, path: `/courses/${course.slug}` };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {}
    return () => lifecycle.abort();
  }, []);
  return null;
}
