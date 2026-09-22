import re,json,pathlib
s=pathlib.Path('docs/requirements.md').read_text()
sections={int(n):v for n,v in re.findall(r'^# (\d+)\. ([\s\S]*?)(?=^# \d+\.|\Z)',s,re.M)}
def bullets(text):
 return [re.sub(r'`','',x.strip()) for x in re.findall(r'^\* (.+)',text,re.M)]
def modules(num):
 text=sections[num]
 parts=re.split(r'^## (.+)$',text,flags=re.M)
 return [{'title':re.sub(r'Module \d+ — ','',parts[i]),'topics':bullets(parts[i+1])} for i in range(1,len(parts),2)]
sf=modules(21)
for n in range(22,33):
 t=sections[n];title=t.splitlines()[0].strip().title().replace('Salesforce ','').replace('Lwc','LWC').replace('Apex','Apex').replace('Soql & Sosl','SOQL & SOSL')
 sf.append({'title':title,'topics':bullets(t)})
base=[('salesforce','Salesforce','CRM & CLOUD DEVELOPMENT','Become a job-ready Salesforce professional.','Master administration, Apex, Lightning Web Components and professional development practices through hands-on projects.',['Admin','Apex','LWC','SOQL','Flow','Git'],sf,['Basics','Admin','Data Model','Security','Automation','JavaScript','Apex','SOQL','LWC','Testing','Git','Real Project','Interview Prep'],'Customer Service Management System','Design a CRM that helps a service team manage customer requests, automate assignments and measure response performance.'),('mern-stack','MERN Stack','FULL STACK DEVELOPMENT','Build complete modern web applications.','Go from your first React component to a complete application with APIs, databases, authentication and deployment.',['MongoDB','Express','React','Node.js'],modules(35),['HTML','CSS','JavaScript','React','Node','Express','MongoDB','REST API','Authentication','Testing','Deployment','Real Project'],'Full Stack E-Commerce Platform','Build a responsive storefront with product search, a shopping cart, secure accounts and an order-management dashboard.'),('ui-ux','UI/UX Design','PRODUCT & EXPERIENCE DESIGN','Design digital products people love to use.','Turn meaningful research into thoughtful interfaces, interactive prototypes and a portfolio-ready product case study.',['Figma','Research','Prototyping','Design Systems'],modules(37),['Research','Problem','Persona','User Flow','Wireframe','Visual Design','Prototype','Test','Design System','Portfolio'],'End-to-End SaaS Product Design','Research a team productivity problem and design an accessible SaaS experience from interviews to developer handoff.'),('python','Python','PROGRAMMING & AUTOMATION','Learn Python through practical programming.','Build a strong programming foundation, automate everyday tasks and create useful APIs with Python.',['Python','OOP','APIs','Automation'],modules(39),['Syntax','Logic','Data Structures','Functions','OOP','Files','APIs','Database','Testing','Automation','Real Project'],'API & Automation Platform','Create a reliable API and reporting workflow that reads data, validates it and automates repetitive work.')]
courses=[]
for slug,title,category,headline,desc,tech,mods,road,proj,problem in base:
 for m in mods:
  if not m['topics']:m['topics']=['Practical exercises','Guided implementation','Project application']
 courses.append(dict(slug=slug,title=title,category=category,headline=headline,description=desc,technologies=tech,modules=mods,roadmap=road,project={'title':proj,'problem':problem},prerequisites=['A laptop with a stable internet connection','Willingness to practise between sessions'],audience=['College students','Graduates','Working professionals','Career switchers']))
pathlib.Path('shared/courses.json').write_text(json.dumps(courses,indent=2))
pathlib.Path('docs').mkdir(exist_ok=True)
pathlib.Path('docs/requirements.md').write_text(s)
