# SchoolConnect - Architecture Diagram

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        SCHOOLCONNECT SYSTEM                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  React 18 + TypeScript + Vite + TailwindCSS                   │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   PUBLIC    │  │    AUTH     │  │  DASHBOARD  │            │
│  │   PAGES     │  │   PAGES     │  │   PAGES     │            │
│  │             │  │             │  │             │            │
│  │ • HomePage  │  │ • Login     │  │ • Teacher   │            │
│  │ • Features  │  │ • Register  │  │ • Admin     │            │
│  │ • Pricing   │  │ • Forgot    │  │ • Platform  │            │
│  │ • Contact   │  │   Password  │  │   Admin     │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┤
│  │                    COMPONENTS LAYER                         │
│  ├─────────────────────────────────────────────────────────────┤
│  │ • Layout (Header, Footer, Sidebar)                         │
│  │ • Auth (PrivateRoute, Login Forms)                         │
│  │ • Dashboard (Role-specific dashboards)                     │
│  │ • Teacher (Grade Manager, Class Manager)                   │
│  │ • AI Integration (Bulletin Generator, AI Examples)         │
│  └─────────────────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        SERVICE LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │    AUTH     │  │     AI      │  │  BULLETIN   │            │
│  │  CONTEXT    │  │  SERVICE    │  │  SERVICE    │            │
│  │             │  │             │  │             │            │
│  │ • Login     │  │ • Bulletin  │  │ • Grade     │            │
│  │ • Register  │  │   Analysis  │  │   Calc      │            │
│  │ • Session   │  │ • Report    │  │ • AI        │            │
│  │   Mgmt      │  │   Gen       │  │   Comments  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   HOOKS     │  │   UTILS     │  │   TYPES     │            │
│  │             │  │             │  │             │            │
│  │ • useAI     │  │ • cn        │  │ • User      │            │
│  │   Integration│  │ • helpers   │  │ • School    │            │
│  │ • useAuth   │  │ • format    │  │ • Student   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND LAYER                           │
├─────────────────────────────────────────────────────────────────┤
│                        SUPABASE                                │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │    AUTH     │  │  DATABASE   │  │  REALTIME   │            │
│  │             │  │             │  │             │            │
│  │ • JWT       │  │ • PostgreSQL│  │ • WebSocket │            │
│  │ • Sessions  │  │ • RLS       │  │ • Live      │            │
│  │ • Roles     │  │ • Triggers  │  │   Updates   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE SCHEMA                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │    USERS    │────│   SCHOOLS   │────│   CLASSES   │         │
│  │             │    │             │    │             │         │
│  │ • id        │    │ • id        │    │ • id        │         │
│  │ • email     │    │ • name      │    │ • name      │         │
│  │ • role      │    │ • address   │    │ • level     │         │
│  │ • school_id │    │ • settings  │    │ • school_id │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│         │                                       │               │
│         └───────────────┐               ┌──────┘               │
│                         │               │                      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  STUDENTS   │────│   GRADES    │    │ ATTENDANCE  │         │
│  │             │    │             │    │             │         │
│  │ • id        │    │ • id        │    │ • id        │         │
│  │ • name      │    │ • student_id│    │ • student_id│         │
│  │ • class_id  │    │ • subject   │    │ • date      │         │
│  │ • parent_id │    │ • grade     │    │ • status    │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │  MESSAGES   │    │NOTIFICATIONS│    │  PAYMENTS   │         │
│  │             │    │             │    │             │         │
│  │ • id        │    │ • id        │    │ • id        │         │
│  │ • sender_id │    │ • user_id   │    │ • student_id│         │
│  │ • content   │    │ • message   │    │ • amount    │         │
│  │ • timestamp │    │ • read      │    │ • status    │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERACTIONS                      │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      REACT COMPONENTS                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   PAGES     │  │ COMPONENTS  │  │   HOOKS     │            │
│  │             │  │             │  │             │            │
│  │ Handle UI   │  │ Render UI   │  │ Manage      │            │
│  │ Events      │  │ Elements    │  │ State       │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   AUTH      │  │     AI      │  │  BUSINESS   │            │
│  │  SERVICE    │  │  SERVICE    │  │   LOGIC     │            │
│  │             │  │             │  │             │            │
│  │ • Login     │  │ • Generate  │  │ • Validate  │            │
│  │ • Register  │  │   Bulletins │  │ • Calculate │            │
│  │ • Logout    │  │ • Analysis  │  │ • Process   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE CLIENT                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │    AUTH     │  │  DATABASE   │  │  REALTIME   │            │
│  │             │  │             │  │             │            │
│  │ • JWT       │  │ • CRUD      │  │ • Subscribe │            │
│  │ • Session   │  │ • Query     │  │ • Listen    │            │
│  │ • Refresh   │  │ • RLS       │  │ • Notify    │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      POSTGRESQL DATABASE                       │
│                                                                 │
│  • Tables with RLS policies                                    │
│  • Triggers for updated_at timestamps                          │
│  • Indexes for performance                                     │
│  • Foreign key relationships                                   │
│  • Audit trails and logging                                    │
└─────────────────────────────────────────────────────────────────┘
```

## 🎯 User Role Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LOGIN                             │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ROLE DETECTION                            │
│                                                                 │
│  if (role === 'platform_admin') → Platform Admin Dashboard     │
│  if (role === 'school_admin')   → School Admin Dashboard       │
│  if (role === 'teacher')        → Teacher Dashboard            │
│  if (role === 'parent')         → Parent Dashboard             │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DASHBOARD FEATURES                          │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │ PLATFORM ADMIN  │  │  SCHOOL ADMIN   │  │    TEACHER      │ │
│  │                 │  │                 │  │                 │ │
│  │ • All Schools   │  │ • School Mgmt   │  │ • Classes       │ │
│  │ • System Config │  │ • Users         │  │ • Grades        │ │
│  │ • Analytics     │  │ • Reports       │  │ • Attendance    │ │
│  │ • Support       │  │ • Settings      │  │ • AI Bulletins  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│                                                                 │
│  ┌─────────────────┐                                           │
│  │     PARENT      │                                           │
│  │                 │                                           │
│  │ • Child Info    │                                           │
│  │ • Grades        │                                           │
│  │ • Attendance    │                                           │
│  │ • Messages      │                                           │
│  └─────────────────┘                                           │
└─────────────────────────────────────────────────────────────────┘
```

## 🤖 AI Integration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        AI REQUEST                              │
│                                                                 │
│  User clicks "Generate AI Bulletin" button                     │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      useAIIntegration Hook                     │
│                                                                 │
│  • Check cache for existing response                           │
│  • Prepare request with context data                           │
│  • Set loading state                                           │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                       AIService Class                          │
│                                                                 │
│  • Fetch student data from Supabase                           │
│  • Fetch grades and attendance                                │
│  • Calculate averages and statistics                          │
│  • Build AI prompt with context                               │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI PROCESSING                             │
│                                                                 │
│  • Generate contextual comments                               │
│  • Create performance analysis                                │
│  • Format response with metadata                              │
│  • Return structured AI response                              │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RESPONSE HANDLING                         │
│                                                                 │
│  • Cache response for future use                              │
│  • Update UI with generated content                           │
│  • Provide download options                                   │
│  • Track usage statistics                                     │
└─────────────────────────────────────────────────────────────────┘
```

This architecture diagram shows how SchoolConnect is structured as a modern, scalable web application with clear separation of concerns and robust data flow patterns.
