# Project Specification: Fit Kickers MMA & Martial Arts Academy

## 1. Executive Summary
- **Brand Name:** Fit Kickers
- **Business Type:** Combat Sports & Martial Arts Training Academy
- **Target Audience:** 
  - Parents seeking discipline, anti-bullying skills, and motor development for kids.
  - Teens and adults looking for martial arts mastery, self-defense, fitness, or competition.
- **Primary Conversion Goal:** Direct prospective students to the academy enrollment and trial booking flow.

## 2. Core Disciplines & Timetables
The academy offers four distinct disciplines. Selecting any discipline dynamically highlights its details and reveals its specific class schedule:

1. **Taekwondo:** Traditional kicking techniques, flexibility, mental focus, belt progression, and sport sparring.
2. **Kickboxing:** Explosive striking, heavy bag drills, pad work, high-calorie conditioning, and combinations.
3. **Self-Defense:** Real-world situational awareness, joint locks, defense against grabs, escapes, and tactical control.
4. **MMA (Mixed Martial Arts):** Integrated cage striking, wrestling takedowns, ground grappling, wall control, and fighter fitness.

### Timetable Integration Requirement
- Each discipline card/tab acts as a selector.
- When selected, an interactive schedule component filters to display only the time slots relevant to that discipline across all three age groups.

## 3. Age Group Categorization
- **Little Champions (Ages 4–7):** Focus, coordination, fun discipline, basic motor skills, fundamental stance and kicks.
- **Juniors (Ages 8–15):** Anti-bullying defense, athletic conditioning, confidence, technical belt progression, controlled sparring.
- **Adults (Ages 16+):** Real combat effectiveness, stress relief, advanced technique, intense conditioning, optional fight team prep.

## 4. Key Page Sections & Structural Hierarchy
1. **Sticky Navigation Bar:**
   - Fit Kickers logo (Bold Red/White branding).
   - Desktop Links: Disciplines, Age Groups, Coaches, Address & Timetable.
   - Primary Action Button: "Book Free Trial" linking to `/login`.
   - Mobile: Responsive slide-over drawer navigation.
2. **Hero Section (Ambient Dark Video Background):**
   - Full-width HTML5 video element running on loop at low brightness (15–20% opacity) behind a dark backdrop overlay (`bg-black/80`).
   - Impactful headline: "MASTER THE ART OF COMBAT. BUILD UNSTOPPABLE DISCIPLINE."
   - Sub-headline introducing Taekwondo, Kickboxing, Self-Defense, and MMA.
   - Dual CTAs: Primary "Claim 1-Week Free Trial" + Secondary "Explore Disciplines".
3. **Interactive Disciplines & Schedule Section:**
   - 4 selectable discipline cards/tabs with custom martial arts icons.
   - Interactive timetable grid that updates based on the active discipline.
4. **Age Groups Showcase:**
   - 3 cards detailing Little Champions, Juniors, and Adults with tailored benefit bullets.
5. **Head Coaches Showcase:**
   - 3 profile cards featuring coach images, martial arts ranks/titles, brief bios, and a "Watch Highlights" video modal trigger.
6. **Enrollment & Trial Booking:**
   - Use the academy's internal `/login` enrollment flow for trial booking and student registration.
7. **Address & Location Details:**
   - Text display of physical address, operating hours, phone hotline, and contact email.
8. **Footer:**
   - Navigation quick links, social media links, copyright notice.

## 5. Technical Requirements
- **Framework:** Next.js (React App Router)
- **Styling:** Tailwind CSS + Framer Motion
- **Icons:** Lucide React (`lucide-react`)
- **Responsive Breakpoints:**
  - Mobile: 320px – 767px (Single column layout)
  - Tablet: 768px – 1023px (2-column layout)
  - Desktop: 1024px+ (Multi-column grids, desktop navbar)