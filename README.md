# FantasyFootball

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.0.

## Production
https://fantasy-football-hazel.vercel.app/

I did not use netlify because I had configuration problems, it is much faster to use Vercel and for testing purposes, I made the decision to use it.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test:watch` to execute the unit tests via **JEST**

## How use the app

We have the dashboard, we can see in the sidebar the players list and, 
in the content two inputs search (players and coach).

![Dashboard](./src/assets/1.png)

We can see the search league action, you need to write the league name with the highest possible specificity and do a click in your ideal option.

![Dashboard](./src/assets/4.png)

We can see the search player action, you need to write the player name with the highest possible specificity.

![Dashboard](./src/assets/5.png)

We can see a selected player after of searched.

![Dashboard](./src/assets/2.png)

We can see a selected coach after of searched.

![Dashboard](./src/assets/3.png)

## Refactor proyect for v2

1. Study the endpoint https://api-football-v1.p.rapidapi.com/v3/teams?league=1&season=2022 for get the countries teams.

2. Study the endpoint https://api-football-v1.p.rapidapi.com/v3/players/squads?team=${ID} for get the country team

3. Add the team in memory before save in LS

4. Improve UX

5. Save the team when the user select all the players

6. Configurate the formation in the UI for a better UX

7. See https://media-4.api-sports.io/football/teams/26.png for get the flags

## Next step

1. Make the project public and make an Angular video tutorial.






