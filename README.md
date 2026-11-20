# Project Management System

A React and TypeScript workspace for managing projects and tracking assigned tasks. A manager defines the work, chooses a project and assigns an employee. The employee sees their assignments on a three-column board and can update progress without opening a separate edit form.

[Live demo](https://project-management-system-y5bw.vercel.app/) · [Source code](https://github.com/DevsquadEg/project-management-system)

## Follow a task from assignment to completion

1. A manager opens `/projects/add` to create a project, or selects an existing one.
2. On `/tasks/add`, the manager enters a title and description, selects the project and employee, and saves the task.
3. The employee opens `/my-tasks`. The board requests their assigned tasks and groups them by status: `ToDo`, `InProgress` and `Done`.
4. Dragging a card into another column sends its new status to the API. Moving a card up or down within one column changes its display order in local component state.

## Screens by role

| User     | Main screens                                               | What to try                                                                               |
| -------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Visitor  | Login, registration, email verification, password recovery | Register an account and complete email verification, or sign in with an existing account. |
| Manager  | Projects, tasks, users, dashboard                          | Create a task, assign it and reopen its detail view at `/tasks/:id`.                      |
| Employee | My Tasks, dashboard, profile                               | Open the board, move an assigned task and reload to check its saved status.               |

## Run locally

Use Node.js and pnpm 9. Start from a fresh checkout:

```sh
git clone https://github.com/DevsquadEg/project-management-system.git
cd project-management-system
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Vite. The frontend uses the external API configured in `src/service/api.ts`. To exercise the full assignment workflow, use two test accounts with manager and employee roles on that backend.

| Command        | Purpose                                                             |
| -------------- | ------------------------------------------------------------------- |
| `pnpm dev`     | Start the development server with hot reload.                       |
| `pnpm lint`    | Run ESLint.                                                         |
| `pnpm build`   | Run the TypeScript build and generate production assets in `dist/`. |
| `pnpm preview` | Serve the production build locally after building.                  |

## How the frontend works

**Session and navigation.** React Router separates the authentication screens from the signed-in workspace. The protected layout waits for the authentication context to load, then renders the workspace or redirects to `/login`. The shared Axios client reads the current token before each request and adds it as a bearer token.

**Task data.** The employee board loads assignments with `GET /Task`. Moving a card across columns sends `PUT /Task/{id}/change-status` with a body such as `{"status":"InProgress"}`. On reload, the board rebuilds its columns from the server response. This makes reloading a useful check that a status change was saved.

**Interface.** React Hook Form handles forms, dnd-kit powers the task board, Bootstrap and React Bootstrap provide layout and interface components, and AG Charts renders dashboard charts.

## Where to look in the code

| Path                                            | Responsibility                                                            |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| `src/App.tsx`                                   | Route definitions and the two application layouts.                        |
| `src/store/AuthContext/`                        | Session state consumed by the application.                                |
| `src/service/api.ts`                            | API base URL and endpoint definitions.                                    |
| `src/service/urls.ts`                           | Shared Axios client and bearer-token interceptor.                         |
| `src/Pages/Manager/Tasks/TaskForm/TaskForm.tsx` | Loads project and employee choices and handles task creation and editing. |
| `src/Pages/Employee/MyTasks/MyTasks.tsx`        | Loads assignments, groups cards and handles drag and reorder actions.     |

## Verification checklist

- [ ] Open `/my-tasks` in a signed-out browser session. The app should take you to login.
- [ ] With a manager test account, assign a task with a distinctive title to a test employee.
- [ ] Sign in as that employee, move the task to **In Progress**, reload, and confirm it stays there.
- [ ] Move the task to **Done** and verify that the next assignments response contains the updated status.

A production build was verified during documentation review. The two-account walkthrough above is a manual acceptance check.
