# FixLog

> Small maintenance today. Fewer surprises tomorrow.

Organize repairs, keep track of household assets, and never lose a maintenance task.

## Why it matters

FixLog helps people stay on top of maintenance, track their important household items, and reduce the risk of forgotten tasks.

## Features

- Maintenance task dashboard with due dates and priorities
- Track assets such as appliances, electronics, and vehicles
- Status management, search, sorting, and filters
- Local-first persistence without an account

## Tech stack

- **HTML5:** Semantic layout and accessible form labels
- **CSS3:** Responsive dashboard layout, cards, tables, and modals
- **Vanilla JavaScript:** CRUD operations, filtering, date handling, event delegation, DOM updates
- **LocalStorage:** Persistent data saved on the current browser

## Run locally

1. Download and unzip this project.
2. Open `index.html` in a modern browser.
3. Add and edit records; refresh to confirm your changes are saved.

Alternatively, run `python -m http.server 8000` in the project folder and visit `http://localhost:8000`.

No installation, backend, account, or API keys required.

## How to use

1. Add the assets you want to maintain.
2. Create maintenance tasks with optional due dates and priorities.
3. Filter and sort tasks to focus on what's urgent.
4. Mark tasks complete, or reopen them if needed.

## Privacy and limitations

Data stays in the browser's LocalStorage; it is **not synchronized** between devices or browsers. Clearing site storage deletes the records. Example records are included to demonstrate the interface. This is a client-side portfolio project, not a hosted production service.

## Ideas for version 2

- Recurring tasks and notification reminders
- Maintenance history and spending insights
- Optional account-based synchronization

## Resume-ready project bullet

Developed FixLog, a responsive home-maintenance management app with task and asset CRUD, due-date prioritization, dashboard analytics, and local persistence.

## Suggested GitHub topics

`javascript` `html` `css` `localstorage` `responsive-design` `portfolio-project`

## License

MIT License. See `LICENSE`.
