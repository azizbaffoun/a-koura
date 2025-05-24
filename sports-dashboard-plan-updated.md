# Sports Vision Website - React Dashboard with Firebase Integration Plan

## 1. Project Setup and Structure

### Understanding the Current Structure
- The existing website is in the HTML folder: `sports-vision-fe0d13.webflow\html`
- All static HTML files are currently served from this directory
- The goal is to integrate a React dashboard while maintaining the existing site structure

### Revised Setup Approach
- **Create React Application as a Separate Directory**
  - Create the React dashboard as a separate directory at the same level as the HTML folder: `/dashboard`
  - Command: `npx create-react-app dashboard` or `npx create-next-app dashboard`
  - This keeps the React app separate from the HTML site but under the same domain

### Current Project Structure

```plaintext
sports-vision-fe0d13.webflow/
├── html/                           # Existing HTML website
│   ├── index.html                  # Landing page
│   ├── home-1.html                 # Main homepage
│   ├── home-2.html                 # Alternative homepage
│   ├── home-3.html                 # Another homepage variant
│   ├── store.html                  # E-commerce store
│   ├── news.html                   # News section
│   ├── about-us.html               # About page
│   ├── match-results.html          # Match results page
│   ├── detail_product.html         # Product details
│   ├── css/                        # CSS stylesheets
│   │   ├── normalize.css
│   │   ├── webflow.css
│   │   └── sports-vision-fe0d13.webflow.css
│   ├── images/                     # Image assets
│   └── js/                         # JavaScript files
├── .vscode/                        # VS Code configuration
└── sports-dashboard-plan-updated.md # This planning document
```

### Planned Architecture

```plaintext
sports-vision-fe0d13.webflow/
├── html/                           # Existing HTML website (unchanged)
│   ├── index.html                  # Main website homepage
│   ├── home-1.html, home-2.html    # Other homepage variants
│   ├── css/                        # CSS stylesheets
│   ├── images/                     # Image assets
│   └── js/                         # JavaScript files
├── dashboard/                      # New React dashboard application (separate from HTML)
│   ├── public/
│   │   ├── index.html              # Dashboard entry point
│   │   └── assets/                 # Dashboard-specific assets
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   ├── layout/             # Layout components
│   │   │   ├── ui/                 # Basic UI elements
│   │   │   ├── dashboard/          # Dashboard-specific components
│   │   │   └── auth/               # Authentication components
│   │   ├── pages/                  # Page components
│   │   ├── hooks/                  # Custom React hooks
│   │   ├── context/                # React context providers
│   │   ├── services/               # Service integrations
│   │   │   └── firebase.js         # Firebase configuration
│   │   ├── utils/                  # Utility functions
│   │   ├── styles/                 # CSS/SCSS styles
│   │   ├── App.jsx                 # Main application component
│   │   └── index.jsx               # Application entry point
│   ├── package.json                # Dependencies and scripts
│   └── .env                        # Environment variables
├── firebase.json                   # Root Firebase configuration
└── .firebaserc                     # Firebase project configuration
```

## 2. Firebase Integration Steps

### Firebase Project Setup
1. **Create a Firebase Project**
   - Go to Firebase Console (https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Google Analytics (recommended)

2. **Register Your Web App**
   - Register the entire domain as one Firebase app
   - Configure Firebase to work with both the static HTML site and React dashboard

### Firebase Configuration for Coexistence
1. **Create Configuration File**
   - Store Firebase config in `dashboard/src/services/firebase.js`
   - Use environment variables to manage different environments

2. **Authentication Setup**
   - Implement authentication that works across both the static site and dashboard
   - Consider using Firebase Auth UI for easier integration with the static site
   - Store authentication state in cookies or localStorage for cross-site recognition

3. **Firestore Database Setup**
   - Create Firestore database in Firebase Console
   - Define database schema and collections:
     - Users
     - Teams
     - Players
     - Matches
     - News
     - Statistics
   - Set up security rules for data access

4. **Firebase Hosting Configuration for Mixed Content**
   - Configure hosting to serve both static HTML and the React SPA
   - Set up proper redirects and rewrites to handle both types of content

## 3. Key Dashboard Features and Components

### Core Dashboard Features
1. **Authentication System**
   - User registration and login
   - Role-based access control (Admin, Coach, Player, Fan)
   - Password reset functionality
   - Social login options

2. **Dashboard Overview**
   - Key performance indicators (KPIs)
   - Upcoming matches widget
   - Recent results widget
   - News feed widget
   - Team standings widget

3. **Team Management**
   - Team profiles and statistics
   - Player roster management
   - Coach and staff directory
   - Team performance analytics

4. **Player Management**
   - Player profiles with statistics
   - Performance tracking
   - Injury reports
   - Contract information

5. **Match Management**
   - Match scheduling
   - Live score updates
   - Match statistics recording
   - Post-match analysis

6. **Content Management**
   - News article creation and publishing
   - Media gallery management
   - Event announcements
   - Social media integration

7. **Statistics and Analytics**
   - Team performance metrics
   - Player statistics
   - League standings
   - Historical data analysis

8. **User Management (Admin)**
   - User role assignment
   - Account management
   - Access control
   - Activity monitoring

## 4. Configuring Routing to Remove File Extensions

### Dual Routing Strategy
1. **Static Site Routing**
   - Implement URL rewriting at the server level to remove .html extensions
   - Create a `.htaccess` file in the root HTML folder

2. **React Router Setup for Dashboard**
   - Configure React Router with a base path:
   ```javascript
   <BrowserRouter basename="/dashboard">
     <Routes>
       {/* Dashboard routes */}
     </Routes>
   </BrowserRouter>
   ```

3. **Handling Cross-Navigation**
   - Create navigation links from static site to dashboard
   - Create links from dashboard back to main site

## 5. Deployment Instructions

### Firebase Deployment for Mixed Content
1. **Configure `firebase.json` for Mixed Content**
   ```json
   {
     "hosting": {
       "public": ".",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "/dashboard/**",
           "destination": "/dashboard/index.html"
         },
         {
           "source": "**",
           "destination": "/html/index.html"
         }
       ]
     }
   }
   ```

2. **Deploy the Entire Site**
   - Run `firebase deploy` from the root directory
   - This will deploy both the static HTML site and the React dashboard

## 6. Development Workflow for Mixed Environment

### Local Development Setup
1. **Run Static Site Locally**
   - Use a simple HTTP server: `npx serve html`
   - Or configure a local Apache/Nginx server

2. **Run React Development Server**
   - Use `npm start` in the dashboard directory
   - Configure proxy settings in `package.json` if needed

3. **Testing the Integration**
   - Test navigation between static site and React app
   - Verify authentication works across both environments
   - Check that shared resources load correctly
