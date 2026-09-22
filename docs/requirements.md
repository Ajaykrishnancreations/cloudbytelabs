# CloudByteLabs Website Redesign

## Master Product Requirements Document — React.js

**Domain:** cloudbytelabs.com
**Product Type:** Modern IT Training / EdTech Marketing Website
**Primary Focus:** Salesforce Training
**Secondary Courses:** MERN Stack, UI/UX Design, Python
**Platform:** Responsive Web — Desktop, Tablet and Mobile
**Default Language:** English
**Additional Languages:** Tamil, Hindi, Malayalam, Kannada

---

# 1. PRODUCT VISION

Build CloudByteLabs into a premium, modern, trustworthy technology-training website that immediately communicates:

> Learn from professionals who actually work with the technologies they teach.

The website must not feel like a traditional training-center website.

It should feel like a combination of:

* Modern SaaS website
* Premium EdTech platform
* Technology career platform
* Interactive learning roadmap
* Career guidance portal

The experience should be clean, modern, animated, professional and highly attractive to:

* College students
* Recently graduated students
* Job seekers
* Working professionals
* People switching careers into IT
* Existing developers upgrading their skills

The website must be extremely polished on mobile devices.

---

# 2. CORE BUSINESS MESSAGE

CloudByteLabs provides practical technology training delivered by people with genuine industry experience.

Primary positioning:

### Learn from people who build real software.

Supporting messages:

* Industry-focused curriculum
* Practical coding
* Real-world projects
* Flexible class timings
* Morning and evening batches
* Mentorship support
* Interview preparation
* Resume and portfolio support
* Real development workflows
* Hands-on assignments
* Code reviews
* Career guidance

Avoid making an unconditional "100% job guarantee" claim unless CloudByteLabs has formal written terms supporting that promise.

Instead use:

> Become industry-ready with practical training, projects, interview preparation and career support.

or:

> We don't just teach technology. We prepare you to work with it professionally.

---

# 3. PRIMARY COURSES

The website will initially highlight four major programs.

1. Salesforce
2. MERN Full Stack Development
3. UI/UX Design
4. Python Development

Salesforce must receive the strongest visual prominence because it is the primary CloudByteLabs offering.

---

# 4. TARGET USERS

## 4.1 College Student

Needs:

* Beginner-friendly learning path
* Flexible classes around college
* Projects
* Internship/job preparation
* Resume
* GitHub guidance
* Interview preparation

Website messaging:

> Build skills before graduation.

---

## 4.2 Recently Graduated Student

Needs:

* Structured learning
* Real-world project exposure
* Job-ready development skills
* Interview preparation
* Portfolio
* Career guidance

Website messaging:

> Turn your degree into practical industry skills.

---

## 4.3 Working Professional

Needs:

* Morning/evening classes
* Weekend/flexible options
* Advanced concepts
* Career switch support
* Practical projects

Website messaging:

> Upgrade your skills without leaving your current job.

---

## 4.4 Career Switcher

Needs:

* Beginner roadmap
* Clear prerequisites
* Mentor guidance
* Industry orientation
* Interview assistance

Website messaging:

> Start from the fundamentals and progress toward real-world development.

---

# 5. DESIGN DIRECTION

The UI should look premium, futuristic and technology-oriented without becoming visually noisy.

Recommended visual style:

* Modern dark/light hybrid sections
* Deep navy / indigo primary palette
* Electric blue/cyan accents
* Subtle violet gradients
* Large typography
* Soft cards
* Rounded corners
* Subtle glassmorphism where appropriate
* Clean spacing
* Animated technology elements
* Interactive roadmaps
* Code snippets
* Floating technology icons
* Gradient borders
* Animated backgrounds
* Grid patterns
* Subtle glow effects

Do not create an old-style corporate training website.

---

# 6. TYPOGRAPHY

Recommended:

**Headings:** Manrope / Plus Jakarta Sans
**Body:** Inter

Hero headings should be large and powerful.

Desktop:

48–72px depending on section.

Mobile:

36–44px maximum with appropriate wrapping.

---

# 7. RESPONSIVENESS

The entire website must be designed mobile-first.

Required breakpoints:

* Mobile: 320–767px
* Tablet: 768–1023px
* Desktop: 1024–1439px
* Large desktop: 1440px+

No horizontal scrolling.

Every animation, roadmap, card, chatbot, form and navigation element must work correctly on mobile.

---

# 8. SITE MAP

Create the following routing structure:

```text
/
├── /courses
│   ├── /courses/salesforce
│   ├── /courses/mern-stack
│   ├── /courses/ui-ux
│   └── /courses/python
│
├── /about
├── /how-we-teach
├── /trainers
├── /projects
├── /career-support
├── /testimonials
├── /contact
├── /faq
└── /privacy
```

Existing learner login can optionally remain accessible through a "Student Login" link.

---

# 9. GLOBAL HEADER

Desktop header:

Left:

CloudByteLabs logo.

Center:

* Home
* Courses
* How We Teach
* Projects
* Career Support
* About
* Contact

Courses opens a mega-menu:

### Salesforce

Admin + Development + LWC + Apex

### MERN Stack

MongoDB + Express + React + Node

### UI/UX

Research + Figma + Design Systems

### Python

Programming + APIs + Automation

Right:

* Language selector
* Talk to Us
* Explore Courses

Header should initially be transparent over the hero and transform into a blurred/sticky header while scrolling.

---

# 10. MOBILE HEADER

Mobile:

* Logo
* Language selector
* Hamburger button

Menu opens full-screen or slide-over navigation.

Include clear CTA buttons:

* Explore Courses
* WhatsApp Us
* Call Us

---

# 11. LANGUAGE SELECTOR

Supported languages:

* English — default
* தமிழ் — Tamil
* हिंदी — Hindi
* മലയാളം — Malayalam
* ಕನ್ನಡ — Kannada

Use `react-i18next`.

Store language preference in localStorage.

Language switching should happen without refreshing the page.

Translate:

* Navigation
* Buttons
* Main website content
* Course descriptions
* FAQs
* Contact sections
* Chatbot UI
* Chatbot replies

Technical/course names such as:

React,
Salesforce,
Apex,
SOQL,
MongoDB,
Figma

should normally remain in English while surrounding descriptions are translated.

---

# 12. HOME PAGE

The homepage is the most important page.

It must contain meaningful information immediately and provide direct access to important pages.

---

# 13. HERO SECTION

Create a highly visual animated hero.

Suggested headline:

## Learn Technology From People Who Actually Build With It.

Supporting copy:

> Practical, industry-focused training in Salesforce, MERN Stack, UI/UX and Python—guided by experienced technology professionals.

CTA buttons:

### Explore Courses

Primary

### Talk to a Mentor

Secondary

Below CTA:

* Live instructor-led learning
* Real-world projects
* Flexible timings
* Career guidance

Right side desktop:

Interactive visual showing technology orbit/cards:

Salesforce
React
Node.js
MongoDB
Python
Figma

Use subtle floating animation.

Mobile:

Visual appears underneath content.

---

# 14. QUICK COURSE NAVIGATION

Immediately after hero:

Heading:

## What Do You Want to Learn?

Four large interactive cards.

### Salesforce

Admin → Development → LWC → Apex

CTA:
Explore Salesforce

### MERN Stack

MongoDB → Express → React → Node

CTA:
Explore MERN

### UI/UX

Research → Figma → Prototype → Design System

CTA:
Explore UI/UX

### Python

Fundamentals → OOP → APIs → Projects

CTA:
Explore Python

Cards should animate on hover.

---

# 15. "WHY CLOUDBYTELABS?" SECTION

Heading:

## Training Built Around Real Industry Work

Cards:

### Industry Professionals

Learn from people with professional project experience.

### Real Projects

Understand how requirements become production applications.

### Practical Coding

Spend more time building and less time memorising theory.

### Code Reviews

Understand how professional developers structure and review code.

### Flexible Learning

Morning, evening and flexible sessions for students and professionals.

### Mentor Support

Get guidance while practising, completing assignments and preparing for interviews.

---

# 16. WHO IS THIS FOR?

Create an interactive tab/segmented section.

Tabs:

### College Student

Content:

* Start from fundamentals
* Build projects while studying
* Develop a GitHub portfolio
* Prepare for interviews

CTA:

Build My Career

---

### Graduate

* Structured training
* Practical projects
* Resume support
* Interview preparation
* Career guidance

CTA:

Become Job Ready

---

### Working Professional

* Flexible batches
* Upskilling
* Career transition support
* Real-world development practices

CTA:

Upgrade My Skills

---

# 17. TRAINING EXPERIENCE SECTION

Heading:

## More Than Just Online Classes

Animated learning flow:

```text
Choose Your Goal
        ↓
Get Your Learning Roadmap
        ↓
Join Live Training
        ↓
Practice Every Concept
        ↓
Build Assignments
        ↓
Develop Real Projects
        ↓
Receive Code Reviews
        ↓
Prepare Your Portfolio
        ↓
Mock Interviews
        ↓
Career Support
```

Desktop animation:

Horizontal timeline.

Mobile:

Vertical timeline.

---

# 18. TRAINERS SECTION

Heading:

## Learn From Industry Professionals

Copy:

> Our trainers bring real development experience into every session—so students learn not only how technology works, but how it is actually used in professional projects.

Trainer cards should support:

* Photo
* Name
* Role
* Experience
* Technologies
* LinkedIn
* Short description

Never publish employer information without the trainer/client's approval.

---

# 19. FEATURED PROJECTS

Heading:

## Learn By Building

Examples:

Salesforce:

### Customer Service Management System

MERN:

### Full Stack E-Commerce Platform

Python:

### API & Automation Platform

UI/UX:

### End-to-End SaaS Product Design

Each card:

* Problem
* Technologies
* Skills learned
* Screens/project preview
* View Project

---

# 20. SALESFORCE COURSE

Salesforce is the flagship course.

Course hero:

# Become a Job-Ready Salesforce Professional

Subtitle:

> Learn Salesforce Administration, Development, Lightning Web Components, Apex, automation, security and professional development practices through hands-on projects.

Buttons:

* View Curriculum
* Talk to Salesforce Mentor
* Join Next Batch

Technology badges:

Admin
LWC
Apex
SOQL
Flow
Security
Git
Testing

---

# 21. SALESFORCE CURRICULUM

Create curriculum as expandable modules.

## Module 1 — Salesforce Ecosystem

Cover:

* What is Salesforce?
* CRM fundamentals
* Salesforce architecture
* Salesforce clouds overview
* Salesforce terminology
* Trailhead
* Developer org
* Setup
* App Launcher

---

## Module 2 — Salesforce Administration

Cover:

* Users
* Roles
* Profiles
* Permission Sets
* Permission Set Groups
* Licenses
* Login access
* Sharing model
* Organization-Wide Defaults
* Role hierarchy
* Sharing rules
* Manual sharing
* Field-Level Security

---

## Module 3 — Data Modelling

Cover:

* Standard objects
* Custom objects
* Standard fields
* Custom fields
* Formula fields
* Relationships
* Lookup
* Master-detail
* Junction objects
* Schema Builder
* Record types
* Page layouts

---

## Module 4 — Salesforce Data Management

Cover:

* Import Wizard
* Data Loader
* Import/export
* Duplicate management
* Validation rules
* Data quality
* Data security

---

## Module 5 — Reports & Dashboards

Cover:

* Report types
* Tabular reports
* Summary reports
* Matrix reports
* Joined reports
* Filters
* Formulas
* Dashboards
* Dynamic dashboards

---

## Module 6 — Salesforce Automation

Cover:

* Flow fundamentals
* Record-triggered flows
* Screen flows
* Scheduled flows
* Subflows
* Decisions
* Loops
* Assignments
* Error handling
* Flow debugging
* Automation best practices

---

## Module 7 — Development Fundamentals

Before LWC/Apex teach:

* HTML
* CSS
* JavaScript
* ES6+
* Variables
* Functions
* Arrays
* Objects
* Async programming
* Promises
* Modules
* DOM basics

---

# 22. LIGHTNING WEB COMPONENTS

Cover comprehensively:

### LWC Fundamentals

* LWC architecture
* Component structure
* HTML
* JavaScript
* CSS
* XML metadata

### Data Binding

* Reactive properties
* Getters
* Conditional rendering
* Loops

### Components

* Parent/child communication
* Public properties
* Public methods
* Custom events

### Salesforce Data

* Lightning Data Service
* UI Record API
* Wire adapters
* `@wire`

### Apex Integration

* Calling Apex
* Wire Apex
* Imperative Apex calls
* Parameters
* Responses
* Error handling
* Caching
* Refreshing data

### Navigation

* NavigationMixin
* Record navigation
* Custom pages

### User Experience

* SLDS
* Lightning base components
* Toast messages
* Spinners
* Modals
* Datatables
* Forms

### Advanced LWC

* LMS
* Custom events
* Reusable components
* Performance
* Security
* Component architecture

---

# 23. APEX DEVELOPMENT

Cover:

* Apex syntax
* Variables
* Collections
* Lists
* Sets
* Maps
* Classes
* Methods
* Constructors
* OOP concepts
* Interfaces
* Inheritance
* Exceptions

---

# 24. SOQL & SOSL

Teach:

* SELECT
* WHERE
* ORDER BY
* LIMIT
* Relationships
* Parent-to-child
* Child-to-parent
* Aggregate queries
* Dynamic SOQL
* SOSL
* Query optimisation

---

# 25. TRIGGERS

Cover:

* Trigger context
* Before trigger
* After trigger
* Insert
* Update
* Delete
* Undelete

Professional development:

* One-trigger architecture
* Trigger handlers
* Bulkification
* Avoiding SOQL inside loops
* Avoiding DML inside loops
* Governor limits
* Recursion handling
* Error handling

---

# 26. ASYNCHRONOUS APEX

Cover:

* Future methods
* Queueable Apex
* Batch Apex
* Scheduled Apex
* Use cases
* Limits
* Error handling

---

# 27. SALESFORCE SECURITY FOR DEVELOPERS

Cover:

* Sharing
* CRUD
* FLS
* `with sharing`
* `without sharing`
* `inherited sharing`
* Secure Apex
* Secure SOQL
* Lightning security concepts

---

# 28. SALESFORCE TESTING

Teach professional testing, not just code-coverage tricks.

Cover:

* Apex test classes
* Test methods
* Test data
* Test setup
* Positive scenarios
* Negative scenarios
* Bulk scenarios
* User/security scenarios
* Mocking integrations
* Assertions
* Deployment coverage requirements

LWC:

* Jest
* Component unit testing
* Event testing
* DOM testing
* API testing

---

# 29. SALESFORCE CODE QUALITY

Include:

* Naming conventions
* Apex architecture
* Service classes
* Selector patterns where appropriate
* Reusable code
* Error handling
* Logging
* Performance
* Security
* Technical debt

Static analysis:

### Salesforce Code Analyzer

Teach:

* PMD
* ESLint
* Security rules
* Performance rules
* Code smells
* CI validation

Students must learn how to write code that would be acceptable in a professional development team—not merely code that works.

---

# 30. SALESFORCE DEVELOPMENT WORKFLOW

Cover:

* VS Code
* Salesforce CLI
* Git
* GitHub
* Branching
* Pull requests
* Code reviews
* Scratch/developer environments
* Deployments
* Metadata
* Package.xml
* CI/CD introduction

---

# 31. SALESFORCE INTEGRATION

Cover:

* REST API
* Callouts
* Named Credentials
* JSON
* Authentication concepts
* External APIs
* Error handling
* Integration patterns

---

# 32. SALESFORCE CAPSTONE PROJECT

Students should build a realistic business application containing:

* Custom objects
* Security
* Permission sets
* Automations
* Apex
* LWC
* Reports
* Dashboards
* Tests
* Code-quality validation
* Git repository

---

# 33. SALESFORCE ROADMAP UI

At the bottom of the Salesforce page create a major animated roadmap.

Desktop:

Horizontal landscape roadmap.

Example:

```text
START
  →
Salesforce Basics
  →
Admin
  →
Data Model
  →
Security
  →
Automation
  →
JavaScript
  →
Apex
  →
SOQL
  →
LWC
  →
Testing
  →
Git
  →
Real Project
  →
Interview Preparation
  →
CAREER READY
```

Use an animated glowing line following the user's scrolling progress.

Mobile:

Convert automatically into a vertical portrait roadmap.

Each milestone animates when entering the viewport.

---

# 34. MERN STACK COURSE

Hero:

# Build Complete Modern Web Applications

Description:

> Learn frontend, backend, APIs, databases, authentication, deployment and professional development workflows using the MERN stack.

Technology:

MongoDB
Express.js
React.js
Node.js

---

# 35. MERN CURRICULUM

## Web Fundamentals

* HTML5
* Semantic HTML
* Forms
* CSS
* Flexbox
* Grid
* Responsive design
* JavaScript fundamentals
* ES6+

## JavaScript

* Variables
* Functions
* Arrays
* Objects
* Scope
* Closures
* Modules
* Promises
* Async/await
* Fetch API
* Error handling

## React

* JSX
* Components
* Props
* State
* Events
* Conditional rendering
* Lists
* Forms
* Hooks
* `useState`
* `useEffect`
* `useRef`
* `useMemo`
* `useCallback`
* Custom hooks
* Context
* State architecture
* Routing
* API integration
* Authentication
* Protected routes
* Component design
* Reusable components
* Performance optimisation
* Error handling
* TypeScript introduction
* Testing
* Production builds

## Node.js

* Node architecture
* Modules
* NPM
* Environment variables
* File system
* Async programming
* Server development

## Express.js

* Server setup
* Routing
* Controllers
* Middleware
* REST APIs
* Validation
* Error handling
* Authentication
* Authorization
* Logging
* Security

## MongoDB

* Databases
* Collections
* Documents
* CRUD
* Querying
* Indexing
* Aggregation
* Data modelling
* MongoDB Atlas
* Mongoose

## Authentication

* Password hashing
* JWT
* Cookies
* Refresh/access token concepts
* Role-based authorization
* Secure authentication

## APIs

* REST architecture
* HTTP
* Status codes
* Pagination
* Filtering
* Searching
* Sorting
* API validation
* Postman

## Professional Development

* Git
* GitHub
* Branches
* Pull requests
* Code review
* Environment management
* ESLint
* Formatting
* Debugging

## Deployment

* Build process
* Frontend deployment
* Backend deployment
* MongoDB Atlas
* Environment variables
* Logs
* Production basics

## MERN Capstone

Build a production-style full-stack application.

Examples:

* E-commerce application
* Learning platform
* Job portal
* CRM
* Booking platform

---

# 36. MERN ROADMAP

```text
HTML
→
CSS
→
JavaScript
→
React
→
Node
→
Express
→
MongoDB
→
REST API
→
Authentication
→
Testing
→
Deployment
→
Real Project
```

Desktop horizontal.

Mobile vertical.

---

# 37. UI/UX COURSE

Hero:

# Design Digital Products People Love to Use

Curriculum:

## UX Foundations

* UX principles
* Design thinking
* Product thinking
* User-centred design

## Research

* User interviews
* Surveys
* Competitor analysis
* Personas
* User needs
* Problem statements

## Information Architecture

* User flows
* Site maps
* Navigation
* Content hierarchy

## Wireframes

* Low fidelity
* Mid fidelity
* User flows

## UI Design

* Typography
* Colour
* Layout
* Spacing
* Hierarchy
* Grid systems
* Icons

## Figma

* Frames
* Components
* Auto Layout
* Variants
* Variables
* Libraries
* Prototyping

## Design Systems

* Tokens
* Components
* Patterns
* Documentation

## Responsive Design

* Desktop
* Tablet
* Mobile
* Breakpoints

## Accessibility

* Contrast
* Keyboard usability
* Forms
* Accessible components

## Prototype & Testing

* Interactive prototypes
* Usability testing
* Feedback
* Iterations

## Developer Handoff

* Specifications
* Assets
* Design tokens
* Responsive rules
* Collaboration

## Portfolio

Students create:

* Case study
* Research
* Wireframes
* Final screens
* Prototype
* Portfolio presentation

---

# 38. UI/UX ROADMAP

```text
Research
→
Problem
→
Persona
→
User Flow
→
Wireframe
→
Visual Design
→
Prototype
→
Test
→
Design System
→
Portfolio
```

---

# 39. PYTHON COURSE

Hero:

# Learn Python Through Practical Programming

Curriculum:

## Fundamentals

* Setup
* Syntax
* Variables
* Data types
* Operators
* Conditions
* Loops

## Data Structures

* Lists
* Tuples
* Sets
* Dictionaries

## Functions

* Functions
* Parameters
* Return values
* Scope
* Lambda

## Object-Oriented Programming

* Classes
* Objects
* Constructors
* Encapsulation
* Inheritance
* Polymorphism

## Advanced Python

* Comprehensions
* Iterators
* Generators
* Decorators
* Context managers

## Error Handling

* Exceptions
* Custom exceptions
* Debugging

## Files

* Text
* JSON
* CSV

## Modules

* Modules
* Packages
* pip
* Virtual environments

## Database

* SQL basics
* Database connections
* CRUD

## APIs

* HTTP
* JSON
* REST APIs
* Calling APIs

## Backend Introduction

Introduce either:

* FastAPI

or

* Flask

depending on curriculum direction.

## Automation

Practical Python scripts for repetitive tasks.

## Testing

* Unit tests
* Debugging
* Code organisation

## Capstone

Build an API, automation platform or practical Python application.

---

# 40. PYTHON ROADMAP

```text
Syntax
→
Logic
→
Data Structures
→
Functions
→
OOP
→
Files
→
Packages
→
Database
→
APIs
→
Automation
→
Project
```

---

# 41. HOW WE TEACH PAGE

Create a dedicated page.

Hero:

# Learn the Way Developers Actually Work

Sections:

### 1. Understand

Trainer explains the concept.

### 2. Watch

Trainer demonstrates real implementation.

### 3. Build

Student implements the feature.

### 4. Review

Trainer reviews the work.

### 5. Improve

Student applies feedback.

### 6. Project

Concept becomes part of a real-world project.

This loop should have an animated circular representation.

---

# 42. FLEXIBLE CLASS SCHEDULE

Create dedicated homepage and course-page sections.

Heading:

## Learning That Fits Around Your Life

Options:

### Morning Sessions

Suitable for students, job seekers and flexible schedules.

### Evening Sessions

Suitable for working professionals and college students.

### Weekend / Flexible Sessions

Subject to trainer/course availability.

Text:

> Tell us your availability and we'll help you identify a suitable learning schedule.

Do not promise literal 24/7 live classes unless the business actually provides them.

---

# 43. CAREER SUPPORT

Dedicated section/page.

Include:

* Resume preparation
* LinkedIn profile guidance
* GitHub preparation
* Portfolio preparation
* Coding assignments
* Mock technical interviews
* HR interview preparation
* Project explanation
* Interview questions
* Job search guidance
* Career mentoring

CTA:

### Talk to a Career Mentor

---

# 44. CHATBOT

A floating AI chatbot must be available across the website.

Position:

Bottom-right.

Mobile:

Must respect safe area and must not block important CTAs.

Button design:

Animated CloudByteLabs assistant icon.

Initial message:

> 👋 Hi! I'm the CloudByteLabs Learning Assistant. What would you like to learn today?

Quick actions:

* Salesforce
* MERN Stack
* UI/UX
* Python
* Course Fees
* Batch Timings
* Talk to Mentor

---

# 45. CHATBOT EXPERIENCE

Chat must be free for website visitors.

No mandatory login.

The assistant should communicate naturally rather than sounding like an FAQ robot.

It should answer detailed curriculum questions.

Example user:

> What will I learn in MERN?

Assistant should explain:

MongoDB, Express, React and Node and provide major curriculum areas.

Example:

> What do you cover in Salesforce?

Assistant should provide a useful detailed explanation covering administration, security, Flow, Apex, SOQL, LWC, testing, Code Analyzer and projects.

Example:

> I am working. Can I attend?

Assistant:

Explain morning/evening/flexible options and invite them to contact a mentor.

---

# 46. CHATBOT KNOWLEDGE

Knowledge source should include structured website data for:

* Salesforce
* MERN
* Python
* UI/UX
* Course curriculum
* Training model
* Trainer information
* Projects
* FAQ
* Class timings
* Contact information
* Pricing when approved
* Batch information when approved

Never let the chatbot invent:

* Fees
* Discounts
* Batch dates
* Trainer names
* Certification promises
* Job guarantees

When information is unavailable:

> I don't want to give you incorrect information. Would you like to speak with a CloudByteLabs mentor?

Then display:

* WhatsApp
* Call
* Contact form

---

# 47. CHATBOT SYSTEM PROMPT

Use a backend-controlled prompt similar to:

```text
You are the CloudByteLabs Learning Assistant.

You help prospective learners understand CloudByteLabs courses,
curriculum, training methods, projects and career support.

Speak naturally, warmly and professionally.

Use only information contained in the CloudByteLabs knowledge base.

Never invent pricing, batch schedules, trainer details,
certification guarantees or placement guarantees.

When asked about a course:
1. Explain it clearly.
2. Mention major technologies/modules.
3. Tailor the explanation to the user's background if known.
4. Suggest the most relevant next step.

Automatically respond in the user's selected website language.
If the user writes in another supported language, respond in that language.

Keep normal responses conversational.
Provide detailed answers when the user asks for detailed curriculum information.

If information isn't available, clearly say so and offer:
- WhatsApp
- Phone call
- Contact form.
```

---

# 48. CHATBOT TECHNICAL ARCHITECTURE

Frontend:

```text
React ChatWidget
     ↓
POST /api/chat
     ↓
Backend
     ↓
Course knowledge/context
     ↓
LLM provider
     ↓
Response
```

Never put the AI provider secret/API key in React frontend code.

Environment:

```text
AI_API_KEY=
AI_MODEL=
```

Add:

* Rate limiting
* Request validation
* Basic abuse protection
* Error handling

Chat history can remain session-based initially.

Do not permanently store conversation content unless required and disclosed.

---

# 49. FLOATING CONTACT ACTIONS

Bottom-right floating actions should include:

### Chat

Opens chatbot.

### WhatsApp

Open:

```text
https://wa.me/{COUNTRY_CODE}{PHONE_NUMBER}
```

Prefilled message:

> Hi CloudByteLabs, I'm interested in learning more about your courses.

### Call

Use:

```text
tel:{PHONE_NUMBER}
```

Desktop:

Floating vertical stack.

Mobile:

Compact floating action menu to prevent UI obstruction.

Phone/WhatsApp numbers must come from configuration, not hardcoded into multiple components.

---

# 50. CONTACT PAGE

Include:

* Name
* Email
* Phone
* Course interested in
* Current status

Status options:

* College Student
* Graduate
* Working Professional
* Career Switcher
* Other

Preferred timing:

* Morning
* Evening
* Weekend
* Flexible

Message.

CTA:

### Request a Callback

Also show:

* Call
* WhatsApp
* Email
* Business hours if supplied

---

# 51. LEAD CAPTURE

Backend lead object:

```json
{
  "name": "",
  "email": "",
  "phone": "",
  "course": "",
  "profileType": "",
  "preferredTime": "",
  "message": "",
  "source": "",
  "createdAt": ""
}
```

Sources can include:

* homepage
* salesforce
* mern
* uiux
* python
* chatbot
* contact
* whatsapp

---

# 52. FAQ

Include searchable FAQ.

Categories:

* Courses
* Eligibility
* Experience
* Class Timings
* Projects
* Trainers
* Career Support
* Certifications
* Payments
* Technical Requirements

Example FAQs:

Can beginners join?

Can working professionals attend?

Are classes live?

Will I work on projects?

Do I need programming experience?

Will Salesforce include Admin and Development?

Does Salesforce include LWC?

Will you teach Apex?

Do you teach code quality and testing?

Will MERN cover complete frontend and backend?

Will UI/UX include Figma?

Does Python require previous coding experience?

---

# 53. TESTIMONIALS

Modern card/carousel design.

Each testimonial:

* Student photo
* Name
* Course
* Role/outcome
* Quote
* Optional LinkedIn verification

Do not invent testimonials.

Only use approved real testimonials.

---

# 54. SOCIAL PROOF

Show real numbers only.

Possible statistics:

```text
Students Trained
Live Training Hours
Real Projects
Industry Mentors
Years of Experience
```

Values must come from the client.

Never use fake counters.

---

# 55. ANIMATION SYSTEM

The client wants strong animations.

Use:

`framer-motion`

Optionally:

`GSAP` only for advanced roadmap/scroll sequences.

Animation styles:

* Fade up
* Blur-to-clear
* Scale reveal
* Stagger cards
* Parallax
* Floating elements
* Animated gradients
* Number counters
* Timeline progress
* SVG drawing
* Course roadmap animation
* Hover tilt
* Cursor-responsive visual effects on desktop

Animations should feel premium, not distracting.

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Disable heavy animations for users requesting reduced motion.

---

# 56. COURSE ROADMAP ANIMATION

This is a major signature interaction.

Desktop:

Roadmap runs horizontally like a journey.

Example visual:

```text
🚀 START ─────●─────●─────●─────●─────●──── 🏆
              │     │     │     │
           Basics Admin  Apex  LWC   Project
```

The route/path fills progressively while the user scrolls.

Individual milestone cards enter with animations.

Mobile:

Transform automatically:

```text
START
  │
  ● Fundamentals
  │
  ● Administration
  │
  ● Development
  │
  ● Project
  │
CAREER READY
```

Vertical scrolling experience.

---

# 57. PAGE TRANSITIONS

Use subtle transitions between routes.

Examples:

* Fade
* Blur
* Slide
* Shared gradient transition

Do not delay navigation.

---

# 58. SEO

Every page requires unique:

* Title
* Description
* Canonical URL
* OpenGraph metadata
* Twitter metadata

Course pages should target natural search phrases such as:

* Salesforce training
* Salesforce Admin training
* Salesforce LWC course
* Salesforce Apex training
* MERN stack course
* React training
* UI UX course
* Python course

Avoid keyword stuffing.

Create:

```text
sitemap.xml
robots.txt
```

Add structured data where appropriate:

* Organization
* Course
* FAQPage
* BreadcrumbList

---

# 59. ACCESSIBILITY

Meet WCAG AA-level design practices where practical.

Include:

* Semantic HTML
* Alt text
* Keyboard navigation
* Visible focus states
* Sufficient colour contrast
* ARIA labels where necessary
* Accessible forms
* Accessible modals
* Accessible menus
* Accessible chatbot
* Reduced-motion support

---

# 60. PERFORMANCE

Target:

Google Lighthouse:

Performance: 90+
Accessibility: 90+
Best Practices: 90+
SEO: 90+

Optimise:

* Images
* Fonts
* JavaScript bundles
* Lazy loading
* Route splitting
* Animations
* API requests

Use WebP/AVIF images where possible.

---

# 61. FRONTEND TECHNOLOGY STACK

Use:

```text
React.js
Vite
TypeScript
React Router
Tailwind CSS
Framer Motion
react-i18next
React Hook Form
Zod
Lucide React
```

Optional:

```text
TanStack Query
GSAP
```

Prefer TypeScript even though the product is referred to as React.js.

---

# 62. BACKEND

Recommended:

```text
Node.js
Express.js
TypeScript
```

Responsibilities:

* Contact forms
* Leads
* Chatbot requests
* Email notifications
* AI provider integration
* Rate limiting
* Server-side validation

---

# 63. DATABASE

For first version:

MongoDB Atlas.

Collections:

```text
leads
contactRequests
courses
trainers
testimonials
faqs
chatSessions (optional)
```

If all course content remains static initially, curriculum can be maintained in frontend/backend structured JSON rather than requiring a full CMS.

---

# 64. CONTENT ARCHITECTURE

Course data should not be hardcoded into individual React components.

Example:

```typescript
interface Course {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  heroDescription: string;
  technologies: string[];
  audience: string[];
  prerequisites: string[];
  modules: CourseModule[];
  projects: Project[];
  roadmap: RoadmapItem[];
  faq: FAQ[];
}
```

Then use:

```text
data/
  courses/
    salesforce.ts
    mern.ts
    uiux.ts
    python.ts
```

This allows the same information to power:

* Course pages
* Search
* Chatbot
* FAQs
* Navigation
* Roadmaps

---

# 65. RECOMMENDED REACT STRUCTURE

```text
src/
├── assets/
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── animations/
│   ├── courses/
│   ├── chatbot/
│   ├── contact/
│   └── roadmap/
│
├── pages/
│   ├── Home/
│   ├── Courses/
│   ├── Salesforce/
│   ├── Mern/
│   ├── UIUX/
│   ├── Python/
│   ├── About/
│   ├── Trainers/
│   ├── Projects/
│   ├── CareerSupport/
│   ├── FAQ/
│   └── Contact/
│
├── data/
│   ├── courses/
│   ├── faq/
│   └── translations/
│
├── hooks/
├── services/
├── utils/
├── types/
├── routes/
├── i18n/
├── App.tsx
└── main.tsx
```

---

# 66. API DESIGN

Recommended APIs:

```text
POST /api/contact
POST /api/leads
POST /api/chat

GET /api/courses
GET /api/courses/:slug
GET /api/faqs
GET /api/trainers
GET /api/testimonials
```

If content remains static, only POST APIs are necessary initially.

---

# 67. FORM SECURITY

Every form should include:

* Frontend validation
* Backend validation
* Sanitisation
* Rate limiting
* Spam protection
* Error states
* Loading states
* Success confirmation

Consider Cloudflare Turnstile for public forms.

---

# 68. ANALYTICS

Integrate:

Google Analytics 4.

Track:

```text
course_view
course_cta_click
whatsapp_click
call_click
chat_open
chat_message
contact_form_start
contact_form_submit
language_change
roadmap_complete
student_login_click
```

---

# 69. CONVERSION EVENTS

Most important conversions:

1. WhatsApp click
2. Phone call
3. Contact form
4. Request callback
5. Chatbot enquiry
6. Course enquiry
7. Student Login

---

# 70. FOOTER

Footer should contain:

CloudByteLabs logo.

Description:

> Practical technology training built around real industry experience.

### Courses

* Salesforce
* MERN Stack
* UI/UX
* Python

### Company

* About
* Trainers
* Projects
* Career Support
* Contact

### Support

* FAQ
* Privacy
* Terms

### Contact

* Phone
* WhatsApp
* Email

### Language

* English
* Tamil
* Hindi
* Malayalam
* Kannada

Social icons:

* LinkedIn
* Instagram
* YouTube
* Facebook if used

Bottom:

```text
© CloudByteLabs. All rights reserved.
```

Do not hardcode an obsolete copyright year.

---

# 71. DIRECT LINK STRATEGY

Homepage must allow users to reach important actions quickly.

Within the first two scroll sections users should be able to directly access:

* Salesforce
* MERN
* Python
* UI/UX
* WhatsApp
* Call
* Chat
* Course enquiry

Avoid forcing users through many pages.

---

# 72. MOBILE EXPERIENCE REQUIREMENTS

Mobile quality is critical.

On mobile:

* No tiny text
* No horizontal roadmaps
* No overflowing cards
* No hover-only interaction
* Large tap areas
* Floating contact controls must not cover content
* Course curriculum uses accordion layout
* Roadmap switches to vertical
* Hero animation reduces complexity
* Header becomes compact
* Forms are single-column
* Tables become cards
* Chatbot uses nearly full-screen panel
* CTA buttons become thumb-friendly

Test at:

320px
360px
375px
390px
412px
430px

---

# 73. CHATBOT MOBILE BEHAVIOUR

Desktop:

Approx. 380–420px wide floating panel.

Mobile:

Open as:

```text
position: fixed;
inset: 0;
```

with safe areas respected.

Header:

CloudByte Assistant
Online

Controls:

* Minimise
* Close
* Clear conversation

Input should stay visible when mobile keyboard opens.

---

# 74. EMPTY / LOADING / ERROR STATES

Every interactive area must have complete states.

For example chatbot:

Loading:

> Thinking...

Failure:

> I'm having trouble connecting right now. You can still reach our team directly.

Buttons:

* WhatsApp
* Call Us

Contact form success:

> Thanks! We've received your request. Our team will contact you shortly.

---

# 75. BRAND VOICE

CloudByteLabs communication should be:

* Confident
* Friendly
* Professional
* Practical
* Technology-focused
* Clear
* Human

Avoid:

* Excessive corporate jargon
* Fake urgency
* Unrealistic promises
* Too much marketing language
* Unverified employment claims

---

# 76. SAMPLE HOMEPAGE COPY

Hero:

# Learn. Build. Become Industry Ready.

> Master Salesforce, MERN Stack, UI/UX and Python through practical training, real-world projects and guidance from experienced technology professionals.

CTA:

**Explore Courses**

Secondary:

**Talk to a Mentor**

Supporting line:

> Flexible learning for students, graduates and working professionals.

---

# 77. SALESFORCE HOMEPAGE FEATURE

Because Salesforce is the flagship course, create a large premium section.

Heading:

## Go Beyond Salesforce Basics.

Animated sequence:

```text
Admin
↓
Security
↓
Flow
↓
Apex
↓
SOQL
↓
LWC
↓
Testing
↓
Code Quality
↓
Real Project
```

Text:

> Learn how professional Salesforce teams configure, develop, test and deliver applications—not just how to pass through tutorials.

CTA:

Explore Salesforce Program

---

# 78. "REAL DEVELOPMENT" SECTION

Heading:

## We Teach More Than Syntax.

Split screen.

Left:

Typical learning:

```text
Watch
Copy
Finish
```

Right:

CloudByteLabs:

```text
Understand
Design
Build
Debug
Test
Review
Improve
Deploy
```

Animate comparisons while scrolling.

---

# 79. CODE EXPERIENCE SECTION

Show interactive code windows.

Tabs:

* LWC
* React
* Apex
* Node
* Python

Display short educational example code with syntax highlighting.

Use this primarily as visual storytelling.

---

# 80. COURSE COMPARISON

Create optional comparison section.

| Course     | Best For               | Main Skills               |
| ---------- | ---------------------- | ------------------------- |
| Salesforce | CRM & cloud careers    | Admin, Apex, LWC          |
| MERN       | Full-stack development | React, Node, MongoDB      |
| UI/UX      | Product design         | Figma, UX, design systems |
| Python     | Programming/backend    | Python, APIs, automation  |

CTA:

Not sure which one?

### Ask Our Learning Assistant

---

# 81. INTERACTION DETAILS

Buttons:

* subtle scale
* glow
* arrow movement

Cards:

* raise slightly on hover
* border gradient
* technology icon movement

Roadmaps:

* SVG line drawing
* milestone reveal

Section titles:

* staggered reveal

Stats:

* count animation only when real statistics are available.

---

# 82. PRIVACY

Provide Privacy page explaining:

* Form information
* Analytics
* Chat messages if stored
* Cookies
* Third-party services
* WhatsApp redirection

Provide consent where legally required.

---

# 83. OPTIONAL FUTURE ADMIN PORTAL

Design architecture so a future admin portal can manage:

* Courses
* Modules
* Trainers
* Batch dates
* Testimonials
* FAQs
* Leads
* Contact enquiries

Do not make the initial marketing release dependent on a complicated admin system.

---

# 84. FUTURE FEATURES

Architecture should permit later addition of:

* Student registration
* Online payments
* Batch management
* Learning dashboard
* Recorded classes
* Certificates
* Assignments
* Attendance
* Quiz
* Student progress
* Instructor dashboard
* Placement portal

These are future scope and must not delay the marketing website.

---

# 85. DO NOT DO

Do not:

* Copy the current website UI
* Build one giant React component
* Use fake student statistics
* Use fake reviews
* Use fake companies
* Use lorem ipsum
* Hardcode all course content inside JSX
* Expose API keys
* Claim guaranteed employment without evidence
* Use excessive autoplay video
* Use animations that damage usability
* Ignore mobile screens
* Leave placeholder pages unfinished
* Generate buttons that do nothing

Every visible CTA must work.

---

# 86. REQUIRED DELIVERABLE

Generate a complete production-ready repository.

The final repository must include:

```text
frontend/
backend/
README.md
.env.example
.gitignore
```

Provide:

* Fully responsive React frontend
* Complete routes
* Reusable components
* Course content
* All four course pages
* Animated roadmaps
* Chatbot UI
* Chat API
* Contact APIs
* WhatsApp integration
* Click-to-call integration
* Multilingual architecture
* Forms
* Validation
* SEO
* Analytics hooks
* Responsive navigation
* Footer
* Error pages
* Loading states
* Accessibility
* Deployment documentation

---

# 87. AI IMPLEMENTATION INSTRUCTION

When this PRD is supplied to an AI coding system, follow this instruction:

> Build the complete CloudByteLabs website described in this PRD. Do not create only a landing page, prototype or static mock-up. Create the complete working React application and required backend. Implement every page, route, responsive layout, course curriculum, animated roadmap, language selector, contact action, chatbot interface, API integration structure, form validation, mobile navigation, SEO metadata and error state described here.

> Use reusable components and production-quality TypeScript. Use React, Vite, React Router, Tailwind CSS, Framer Motion and react-i18next for the frontend. Use Node.js/Express with TypeScript for secure backend operations.

> Treat Salesforce as the flagship course and give it the richest page and curriculum.

> Course content must be stored as structured reusable data instead of being duplicated across JSX.

> Build the UI mobile-first and ensure every component works at 320px width through large desktop screens.

> Use high-quality purposeful animations throughout the website while keeping performance and accessibility strong.

> The desktop course roadmap must be landscape/horizontal and the mobile version must automatically transform into a portrait/vertical roadmap.

> Implement a floating CloudByteLabs AI learning assistant available on every route. The assistant must use website/course knowledge, answer naturally, support English, Tamil, Hindi, Malayalam and Kannada, and never invent fees, batches or guarantees.

> Implement floating WhatsApp and Call buttons using configuration/environment values. Do not invent contact numbers.

> Do not leave placeholder buttons, unfinished sections, lorem ipsum, mock statistics, fake testimonials or fake contact information.

> Where business information has not been supplied—such as phone number, WhatsApp number, email, course fee, trainer names, batch timings or verified statistics—create clearly named configuration values and allow the content to be added without changing component code.

> Use visually rich sections, scroll-based animations, code demonstrations, timelines and technology illustrations while maintaining a clean premium interface.

> Complete the website as if it is intended to be deployed publicly to cloudbytelabs.com.

---

# 88. DEFINITION OF DONE

The website is complete only when:

* All routes work
* All four courses have complete pages
* Salesforce includes Admin + Apex + LWC
* Salesforce includes testing/code-quality concepts
* MERN includes frontend + backend + DB
* UI/UX includes full product-design workflow
* Python has beginner-to-project curriculum
* Roadmaps animate correctly
* Roadmap is horizontal on desktop
* Roadmap is vertical on mobile
* Chatbot works
* WhatsApp works
* Click-to-call works
* Contact form works
* Language switching works
* English is default
* Tamil works
* Hindi works
* Malayalam works
* Kannada works
* Navigation works
* Mobile menu works
* SEO metadata exists
* All pages are responsive
* No horizontal mobile overflow
* Forms validate correctly
* APIs handle errors
* Secret keys remain server-side
* Reduced-motion mode works
* Accessibility basics are met
* All CTAs perform real actions
* No placeholder content remains
* Website is deployment-ready
