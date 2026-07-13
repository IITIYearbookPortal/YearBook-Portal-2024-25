# Alumni Cell Yearbook Portal

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=111)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](#license)

The Alumni Cell Yearbook Portal is a full-stack web application for IIT Indore's graduating batch yearbook experience. It lets graduating students create and manage profiles, receive and moderate comments, participate in polls, browse previous yearbook entries, and collect campus memories through an interactive memory map.

The repository contains a React client and an Express/MongoDB server. The frontend handles the user experience, routing, Google sign-in, and API calls, while the backend owns data persistence, file uploads, email verification, comments, polls, and memory moderation.

## Features

- Google Identity based login on the frontend.
- Alumni recognition using the local alumni email list in `client/src/new_components/Navbar/akumniData.json`.
- Profile creation for graduating students with academic details, contact details, personal email, profile image, about text, and yearbook questions.
- Profile image upload through the backend using Multer memory storage and Cloudinary.
- Profile editing with optional profile image replacement.
- User search and profile discovery.
- Comment submission on graduating student profiles.
- Comment moderation by profile owners: new, approved, and rejected comments.
- Approved comment reordering through drag and drop.
- Comment editing by comment authors.
- Separate current-student and graduating-student comment storage.
- Poll creation, voting, deletion, and result viewing.
- Poll grouping by academic program.
- Admin-only poll controls driven by frontend environment configuration.
- Previous yearbook senior list and senior detail pages.
- Interactive campus memory map.
- Memory creation with up to three uploaded images.
- Memory approval/rejection flow for tagged seniors before memories become public.
- Printable memory summary for related memories.
- AdminBro-based backend admin panel for selected MongoDB resources.
- Basic origin checks and CORS configuration on the backend.
- Custom UI components for buttons, inputs, textareas, tooltips, toast notifications, and memory-map views.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, Create React App, React Router, React Context |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | Google Identity Services on the client, JWT-decoded Google credential stored in `localStorage`, email verification token for personal email verification |
| State Management | React `useState`, `useEffect`, Context API, TanStack React Query provider |
| Styling | Tailwind CSS, CSS modules, plain CSS, Sass, Bootstrap, Chakra UI, MUI icons, Radix UI primitives, Lucide icons |
| File Storage | Cloudinary, Multer memory storage |
| Email | Nodemailer with Gmail transport |
| Admin | AdminBro with Mongoose adapter and basic auth |
| Build Tools | Create React App, PostCSS, Tailwind CSS, Nodemon |
| Deployment | `buildspec.yaml` is present for a server copy step; client production builds are generated with `react-scripts build` |
| Other Libraries | Axios, React Toastify, Sonner, Firebase Analytics, Chart.js, react-beautiful-dnd, dnd-kit, react-international-phone |

## Project Structure

```text
.
|-- client/                  # React frontend application
|   |-- public/              # Static assets and public images
|   |-- src/
|   |   |-- components/      # Shared UI and memory-map components
|   |   |-- config/          # Firebase client configuration
|   |   |-- data/            # Campus map data
|   |   |-- helpers/         # Global React context
|   |   |-- hooks/           # Shared React hooks
|   |   |-- new_components/  # Main feature components and pages
|   |   |-- pages/           # Route-level pages
|   |   |-- App.js           # Client routing and login state orchestration
|   |   `-- index.js         # React entry point
|   |-- package.json
|   `-- tailwind.config.js
|-- server/                  # Express backend application
|   |-- config/              # Cloudinary configuration
|   |-- controllers/         # Request handlers and business logic
|   |-- middlewares/         # Multer upload middleware
|   |-- models/              # Mongoose schemas
|   |-- routes/              # REST route definitions
|   |-- utils/               # JWT helper utilities
|   |-- server.js            # Main backend entry point
|   `-- package.json
|-- buildspec.yaml           # Build/deployment helper used by the repository
|-- package.json             # Root dependency file
`-- README.md
```

## Getting Started

### Prerequisites

- Node.js and npm installed.
- MongoDB connection string.
- Cloudinary account for image uploads.
- Google OAuth client ID for frontend sign-in.
- Gmail account or app password for Nodemailer email delivery.

### Installation

Install dependencies for both applications:

```bash
cd server
npm install

cd ../client
npm install
```

The repository also contains root-level lockfiles and dependencies, but the runnable applications live in `client` and `server`.

### Environment Variables

Create environment files in `client/.env` and `server/.env`. Do not commit real secret values.

#### Client

| Variable | Used by | Purpose |
| --- | --- | --- |
| `REACT_APP_API_URL` | Client API calls | Base URL of the Express API server. |
| `REACT_APP_CLIENT_ID` | `App.js` | Google Identity Services client ID. |
| `REACT_APP_API_KEY` | Firebase config | Firebase API key. |
| `REACT_APP_AUTH_DOMAIN` | Firebase config | Firebase auth domain. |
| `REACT_APP_PROJECT_ID` | Firebase config | Firebase project ID. |
| `REACT_APP_STORAGE_BUCKET` | Firebase config | Firebase storage bucket. |
| `REACT_APP_MESSAGING_SENDER_ID` | Firebase config | Firebase messaging sender ID. |
| `REACT_APP_APP_ID` | Firebase config | Firebase app ID. |
| `REACT_APP_MEASUREMENT_ID` | Firebase config | Firebase analytics measurement ID. |
| `REACT_APP_ADMIN_USERS` | Poll page | Comma-separated email list allowed to create/delete polls in the frontend UI. |
| `REACT_APP_ADMIN_EMAIL` | `client/.env` | Present in the environment file, but not referenced in the current source code. |
| `REACT_APP_CLOUDINARY_LINK` | `client/.env` | Present in the environment file, but not referenced in the current source code. |

#### Server

| Variable | Used by | Purpose |
| --- | --- | --- |
| `PORT` | `server.js`, `app.js` | Backend port. Defaults to `5000` in `server.js`. |
| `MONGODB_LINK` | `server.js` | MongoDB connection URI. |
| `CLIENT_LINK` | `server.js`, user controller | Allowed client origin and redirect target after email verification. |
| `ALLOWED_ORIGIN` | `server.js` | Origin checked by the custom request-origin middleware. |
| `SERVER_LINK` | user controller | Server URL used to generate personal email verification links. |
| `GMAIL_USER` | user controller | Gmail account used by Nodemailer. |
| `GMAIL_PASS` | user controller | Gmail password or app password used by Nodemailer. |
| `SECRET` | user model, user controller | JWT secret for personal email verification tokens. |
| `CLOUDINARY_NAME` | Cloudinary config | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | Cloudinary config | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Cloudinary config | Cloudinary API secret. |
| `ADMIN_USERNAME` | `server.js` | AdminBro basic-auth username. Referenced in code. |
| `ADMIN_PASSWORD` | `server.js` | AdminBro basic-auth password. Referenced in code. |
| `OTP_AUTH_KEY` | `server/.env` | Present in the environment file, but not referenced in the current source code. |
| `OTP_NUMBER` | `server/.env` | Present in the environment file, but not referenced in the current source code. |
| `JWT_SECRET` | `server/.env` | Present in the environment file, but not referenced in the current source code. |
| `USERNAME` | `server/.env` | Present in the environment file, but the code expects `ADMIN_USERNAME`. |
| `PASSWORD` | `server/.env` | Present in the environment file, but the code expects `ADMIN_PASSWORD`. |

### Running Development Server

Run the backend:

```bash
cd server
npm run dev
```

Run the frontend in another terminal:

```bash
cd client
npm start
```

By default, the React app runs on `http://localhost:3000`, and the backend uses `PORT` or falls back to `5000`.

### Building

Build the frontend:

```bash
cd client
npm run build
```

Start the backend in production mode:

```bash
cd server
npm start
```

### Production Deployment

- Build the client with `npm run build` inside `client`.
- Serve the generated `client/build` directory from a static host or configure a reverse proxy to the React app.
- Deploy the Express server from `server/server.js`.
- Set all required server environment variables in the deployment platform.
- Configure `CLIENT_LINK`, `ALLOWED_ORIGIN`, and `REACT_APP_API_URL` to match the production domains.
- The included `buildspec.yaml` copies `server/*` into the build root; review it before using it for a new deployment target.

## Architecture

### Request Flow

The browser renders the React app from `client/src/index.js` and `client/src/App.js`. Route components call the backend through Axios or `fetch`, using `REACT_APP_API_URL` as the base URL. The Express server receives requests in `server/server.js`, applies CORS, origin checks, JSON parsing, cookies, sessions, logging, and then forwards requests to route modules. Route modules call controllers, controllers use Mongoose models, and MongoDB stores the application data.

### State Flow

Most client state is local component state. Shared login and profile state is stored in `LoginContext` from `client/src/helpers/Context.js` and provided from `App.js`. The app also creates a TanStack Query client provider, but the current source code mainly uses direct Axios and `fetch` calls for server communication.

### Authentication Flow

The frontend initializes Google Identity Services using `REACT_APP_CLIENT_ID`. After a Google sign-in, the Google credential is decoded with `jwt-decode` and stored in `localStorage` as `token`.

The client checks `/checkAuth` to see whether the email already exists in the backend `Auth` collection. If the email is in the alumni email list, the app looks for a full profile in the `Users` collection. Alumni without profiles are sent to the fill-details flow. Current students are allowed into student-facing areas such as user search, comments, and polls.

The backend also supports personal email verification through signed JWT links generated with `SECRET`. In the current fill-details flow, profile creation marks both verification flags as true, while older OTP/email verification routes still exist in the code.

### Data Flow

MongoDB stores auth users, graduating student profiles, comments, polls, previous yearbook entries, public memories, and pending memory approvals. Images are uploaded from the client as multipart form data, processed in memory by Multer, uploaded to Cloudinary, and stored in MongoDB as Cloudinary URLs or public IDs.

### API Communication

The frontend uses Axios for most endpoints and `fetch` for memory verification. API requests are made directly from route components and feature components. No generated API client is present.

### Folder Responsibilities

- `client/src/App.js` defines the main client routes, login checks, global context values, and theme mode.
- `client/src/new_components` contains most feature screens: home, navbar, profile, edit profile, comments, polls, fill details, email/OTP screens, team page, and previous UI versions.
- `client/src/components/memory-map` contains the campus memory map experience.
- `server/routes` maps HTTP endpoints to controller functions.
- `server/controllers` contains request handling and persistence logic.
- `server/models` defines MongoDB document shapes with Mongoose.
- `server/config/cloudinary.js` centralizes Cloudinary setup.
- `server/middlewares/multer.js` defines in-memory upload handling and file limits.

## Major Components

| Module | Purpose |
| --- | --- |
| `client/src/App.js` | Main React shell, route definitions, Google login callback handling, profile state setup, and navbar visibility rules. |
| `client/src/new_components/New_homepage/home.jsx` | Landing/home experience. |
| `client/src/new_components/Navbar/Navbar.js` | Main navigation. |
| `client/src/new_components/Fill_Details3/Fill_Details3.js` | Multi-step graduating student profile creation form. |
| `client/src/new_components/prof/prof.js` | Graduating student profile dashboard, comment moderation, profile edit entry point, and memory verification link. |
| `client/src/new_components/MakeComment2/Makeacomment.js` | Comment creation screen for another user's profile. |
| `client/src/new_components/Edit_a_Comment/EditAComment.js` | Existing comment editing flow. |
| `client/src/new_components/Edit_Profile/Edit.js` | Profile update flow. |
| `client/src/new_components/UserList.js` | User search and listing experience. |
| `client/src/new_components/PollPage/PollPage.js` | Poll listing, admin poll creation, and poll deletion UI. |
| `client/src/new_components/PollPage/PollResultsPage.js` | Poll voting and chart/result view. |
| `client/src/components/memory-map/MemoryMapPage.jsx` | Interactive campus memory map and print summary flow. |
| `client/src/pages/VerifyMemories.jsx` | Pending memory approval/rejection page. |
| `server/server.js` | Main Express application, middleware stack, MongoDB connection, AdminBro setup, and route registration. |
| `server/controllers/userDataController.js` | Profile creation, profile update, user search, email verification, and user lookup logic. |
| `server/controllers/commentsController.js` | Comment creation, moderation, retrieval, editing, and ordering logic. |
| `server/controllers/memoriesController.js` | Memory creation, public memory retrieval, and pending memory approval/rejection. |
| `server/controllers/pollsController.js` | Poll creation, voting, deletion, and result retrieval. |

## API Integration

### Frontend-consumed APIs

The React app calls the backend at `REACT_APP_API_URL`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/` | Basic server health/message response. |
| `GET` | `/auth` | Returns auth users. |
| `POST` | `/auth` | Creates a basic auth record after first Google sign-in. |
| `POST` | `/checkAuth` | Checks whether an email exists in the auth collection. |
| `POST` | `/userData` | Creates a full graduating student profile with profile image upload. |
| `GET` | `/userData` | Returns public profile summary data. |
| `GET` | `/getUsersData` | Returns public profile summary data. |
| `GET` | `/getUsersCompleteData/:roll_no` | Returns complete profile data for editing. |
| `PUT` | `/updateUser` | Updates a profile and optionally replaces its profile image. |
| `POST` | `/findAUser` | Finds a graduating student profile by email. |
| `POST` | `/profile` | Returns profile data by email. |
| `POST` | `/wordEntered` | Searches users by name prefix. |
| `POST` | `/searchword` | Looks up a user by email. |
| `GET` | `/verify/:id` | Verifies personal email from an emailed token and redirects to the client. |
| `POST` | `/verify` | Marks first verification step true and sends personal email verification. |
| `POST` | `/resendMail` | Resends personal email verification mail. |
| `POST` | `/userDataNew` | Updates personal email/contact fields and verification flags. |
| `POST` | `/userDataemail` | Updates personal email field. |
| `POST` | `/comments` | Creates a new comment for a profile. |
| `POST` | `/getComments` | Gets comments written by a user. |
| `PUT` | `/setApprovedComments` | Approves a received comment. |
| `POST` | `/setRejectedComments` | Rejects a received comment. |
| `POST` | `/getRecieversComments` | Gets approved, new, and rejected comments for a profile owner. |
| `POST` | `/getRecieversComments2` | Gets approved comments and receiver profile data for public comment views. |
| `POST` | `/removeCommentFromMyComments` | Removes a sent comment from "my comments" logic. |
| `POST` | `/removeCommentFromApprovedComments` | Moves an approved comment back to new status and adjusts order. |
| `POST` | `/updateCommentOrder` | Persists reordered approved comments. |
| `POST` | `/getEditCommentsInfo` | Gets receiver and comment data for editing. |
| `POST` | `/editComment` | Edits a comment and resets it to new status. |
| `POST` | `/ungradmycomment` | Gets current-student comments by email. |
| `POST` | `/protectionEditComment` | Intended comment-author authorization check; expects `req.user`, but no auth middleware is wired in the current routes. |
| `GET` | `/memories` | Gets public memories, optionally filtered by senior query params. |
| `POST` | `/create-memory` | Creates memory records with optional image uploads. |
| `GET` | `/memories/get-pending-requests/:email` | Gets pending memory requests for a senior. |
| `PATCH` | `/memories/accept/:memoryGroupId/:email` | Approves a pending memory group for a senior. |
| `DELETE` | `/memories/delete/:memoryGroupId/:email` | Rejects and deletes a pending memory group for a senior. |
| `GET` | `/polls` | Gets all polls or a specific poll when `pollId` query is supplied. |
| `GET` | `/polls/:id` | Gets one poll by ID. |
| `POST` | `/createPoll` | Creates a poll. |
| `POST` | `/votePoll` | Records one vote for a poll option. |
| `DELETE` | `/polls/:id` | Deletes a poll. |
| `GET` | `/polls/results/:id` | Gets poll result data. |
| `GET` | `/previousYrBook/getSeniors` | Lists previous yearbook seniors. |
| `GET` | `/previousYrBook/getSenior/:roll_no` | Gets one previous yearbook senior by roll number. |
| `GET` | `/check` | Simple backend check endpoint. |

### External Services

| Service | Used for |
| --- | --- |
| Google Identity Services | Frontend sign-in. |
| Firebase Analytics | Client Firebase initialization and analytics. |
| Cloudinary | Profile image and memory image storage. |
| Gmail via Nodemailer | Personal email verification messages. |
| MongoDB | Application data persistence. |

## Database

The backend uses Mongoose models.

| Model | Collection purpose | Important fields |
| --- | --- | --- |
| `Auth` | Basic record for any Google-authenticated user. | `email`, `name` |
| `Users` | Graduating student profile data. | `email`, `name`, `roll_no`, `academic_program`, `department`, contact fields, `about`, `profile_img`, verification flags, yearbook questions, `phoneOTP` |
| `Comments` | Comments received by a graduating student. | `comment_reciever_id`, `comment_sender`, `comment_sender_student`, `status`, `order` |
| `Memory` | Campus memory entries. | `locationId`, `seniorId`, `authorName`, `content`, `images`, `toBeAcceptedBy`, `groupId`, `isDeleted`, `isVerified` |
| `PendingMemory` | Pending memory groups per senior email. | `seniorEmail`, `memoryGroupIds` |
| `Poll` | Poll questions, options, votes, and creator. | `question`, `options`, `votes`, `createdBy`, `academic_program`, `createdAt` |
| `previous_seniors` | Previous yearbook data. | `full_name`, `roll_no`, `profile_pic`, `academic_program`, `department`, `about`, `students_testimonial`, `testimonial_count`, `page_type` |

## Authentication

The client relies on Google Identity Services for initial login. The Google credential is decoded in the browser and saved to `localStorage`; this token is used by the frontend to decide user state and is sent as a bearer token in a few memory-related requests.

On the backend, most routes do not currently enforce bearer-token authentication middleware. Access control is mainly handled in the React UI and by lookup logic in controllers. AdminBro is protected separately with HTTP basic auth using `ADMIN_USERNAME` and `ADMIN_PASSWORD`.

The backend also includes a personal email verification flow. It signs a verification token with `SECRET`, sends a link through Nodemailer, and marks `two_step_verified` true when the link is opened.

## Available Scripts

### Client

| Script | Command | Description |
| --- | --- | --- |
| `npm start` | `react-scripts start` | Starts the React development server. |
| `npm run dev` | `react-scripts start` | Alias for the React development server. |
| `npm run build` | `react-scripts build` | Builds the production frontend. |
| `npm test` | `react-scripts test` | Runs Create React App tests. |
| `npm run eject` | `react-scripts eject` | Ejects Create React App configuration. |

### Server

| Script | Command | Description |
| --- | --- | --- |
| `npm run dev` | `nodemon server.js` | Starts the Express server with reloads. |
| `npm start` | `node server.js` | Starts the Express server. |
| `npm test` | `echo "Error: no test specified" && exit 1` | Placeholder test script. |

The root `package.json` does not define runnable scripts.

## Screenshots

Screenshots coming soon.

![Home](docs/images/home.png)

![Profile](docs/images/profile.png)

![Memory Map](docs/images/memory-map.png)

![Polls](docs/images/polls.png)

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Install dependencies in both `client` and `server`.
4. Keep changes focused and match the existing folder structure.
5. Test the affected frontend pages and backend routes locally.
6. Open a pull request with a clear description of the change.

Please avoid committing real `.env` values, generated build output, or dependency folders.