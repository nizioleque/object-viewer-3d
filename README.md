# Object Viewer

Norbert Niziołek – Grafika komputerowa 1

## Uruchamianie

### Przez stronę internetową (zalecane)

Aplikacja jest dostępna pod adresem https://object-viewer.niziolek.dev.

### Uruchomienie na lokalnej maszynie

Wymagania:

- _NodeJS_ – https://nodejs.org/it/download/. Używana wersja: 16.17.1
- Zalecane: _Yarn_ zamiast _npm_

Aplikację można uruchomić na swoim komputerze na dwa sposoby.

Najpierw należy pobrać to repozytorium. Następnie, w rozpakowanym folderze należy wywołać komendę `npm install` (lub `yarn`) aby pobrać wszystkie zależności.

Następnie, aby uruchomić aplikację:

- poprzez _development server_ (serwer, który na bieżąco odświeża aplikację przy zmianach, niezoptymalizowany): należy wywołać komendę `npm start` (lub `yarn start`). Aplikacja zostanie uruchomiona pod adresem `localhost:3000`
- poprzez _production build_ (produkcyjna wersja, zoptymalizowana): należy wywołać komendę `npm run build` (lub `yarn build`) aby zbudować produkcyjną wersję aplikacji do folderu `build`. Następnie można uruchomić zbudowaną aplikację z tego folderu używając dowolnego web servera, np. tego rozszerzenia do VS Code: https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer

## Instrukcja obsługi

Wszystkie opcje dostępne są w menu z lewej strony ekranu.

Odradza się korzystania z przeglądarki Safari – nie wspiera ona rysowania na oddzielnym wątku, przez co interfejs użytkownika zacina się.
