# Eventer

Simple and fast event emitter library.

TODO: more

## Scripts

Please run **npm install** before starting of anything else.

##### (npm run [scriptName])
  - **test**: npm test - run tests and watch
  - **lint**: npm run lint - run lint and watch
  - **ci:test**: npm run ci:test - run tests once
  - **ci:lint**: npm run ci:lint - run lint once
  - **ci**: npm run ci - run test and lint once
  - **ci:watch**: npm run ci - run test and lint, watch
  - **start**: npm start - build demo, run development server, watch, relode (ex. npm run dev) 


## Contributors Guidelines
TODO: 

MeisterTask is used as a project management system for development coordination. The project management is broken in two scrum boards. One of the boards contains an information about the development of the project, another one about related with its research.

Project development is broken into sprints. Every sprint includes at least two runs. Tasks assigned to the team for a sprint are broken to User Stories. There are two tags to identify completeness. "Work" tag shows that the feature is implemented, but not finalised. Only finalised task with a "clean" code can be marked complete User Stories. 

Every next run starts from finalisation of User Stories which are marked at "Work", but not completed yet.

All Classes, Types, Interfaces and function(except getters and setters) have to be commented in according with TypeDoc guidelines, before stories there they belong are marked as complete.

"Clean" code has to be written in according to with the best practices for high-performance JavaScript. The code has to be as simple and DRY as possible, it should not contain any unnecessary sophisticated constructions. Side effects have to be reduced. All side effects have to be mentioned in the description of function with @sideEffect annotation.