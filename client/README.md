# SkillVista Frontend

### Setup Instruction

1. Clone the project
```
    git repo clone Nitishcoderr/lms-SkillVista
```

2. Move into the directory
```
    cd client
```

3. Install dependency
```
    npm i
```
4. run the server
```
    npm run dev
```

### setup instruction for tailwind

[Tailwind official instruction doc](https://tailwindcss.com/docs/installation)

1. install tailwind css

```
    npm install -D tailwindcss
```

2. create tailwind config file

```
    npx tailwindcss init
```

3. add file extension to tailwind config file in the content property

```
    "./src/**/*.{html,js,jsx,ts,tsx}"
```

4. Add the tailwind directive at the top of the `index.css` file

```
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
```