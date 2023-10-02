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
    npm install -D tailwindcss postcss autoprefixer
```

2. create tailwind config file

```
    npx tailwindcss init
```

3. add file extension to tailwind config file in the content property

```
      content: ["./index.html","./src/**/*.{html,js,jsx,ts,tsx}"],
```

4. Add the tailwind directive at the top of the `index.css` file

```
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
```

### Adding plugins and dependency

```
npm i @reduxjs/toolkit react-redux react-router-dom react-icons react-chartjs-2 chart.js daisyui axios react-hot-toast @tailwindcss/line-clamp
```

### Configure auto import sort eslint

1. Install simple import sort
```
    npm i -D eslint-plugin-simple-import-sort
```

2. Add rule in ``.eslint.cjs`

```
    'simple-import-sort/imports':'error'
```

3. add simple-import sort plugin in `.eslint.cjs`

```
  plugins: [...,'simple-import-sort']
```

4. To enable auto import sort on file save in vscode

    - Open `setting.json`
    - add the following config

```
    "editor.codeActionsOnSave": {
    "source.fixAll.eslint":true 
  }
```