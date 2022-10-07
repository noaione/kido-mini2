# 01 — Dynamic Calendar

This is a dynamic calendar created using HTML and JS (with styling from TailwindCSS)

## Explanation

```html
<body class="bg-gray-900 text-white">
    <main class="flex flex-col py-4">
        <h1 class="text-2xl font-bold mx-auto">Dynamic Calendar</h1>
        <div class="flex flex-col w-full md:w-[50%] lg:w-[30%] mt-10 ml-0 md:ml-1 bg-gray-700">
            <div class="flex flex-row justify-between items-center py-2">
                <h2 class="font-semibold text-xl ml-4"></h2>
                <div class="flex flex-row gap-1 pr-2">
                    <button class="flex flex-col p-2 hover:bg-gray-500 rounded-full items-center justify-center align-middle transition left-cal">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"></path>
                        </svg>
                    </button>
                    <button class="flex flex-col p-2 hover:bg-gray-500 rounded-full items-center justify-center align-middle transition right-cal">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="flex flex-row justify-between items-center mx-2 md:mx-4 py-2" id="calendar"></div>
        </div>
    </main>
    <script src="main.js"></script>
</body>
```

The above code is our HTML file, it basically will render the main body and also some button where we can cycle through previous and next month. We also make an empty `h2` element where we will put our currently selected month and year text.

We also created our main `#calendar` element where we will actually put our calendar data.

**The next thing is to create our `main.js` file**

In the main js file, we will use IIFE to protect our code and to not pollute the global environment.

```js
(function(){
    // code here
})();
```

Inside the IIFE code, we want to add some state management for our code, we can just use const for that:

```js
const DateState = {
    month: -1,
    year: -1,
};
```

Then we can create our code to generate the calendar table, we will be using this format:

```json
{
    0: [
        {
            day: 1,
            active: false
        }
    ]
}
```

Where the first key is the weekday (0 is Sunday to 6 is Saturday)

```js
const dayMappings = {
    // Sunday
    0: [],
    // Monday
    1: [],
    // Tuesday
    2: [],
    // Wednesday
    3: [],
    // Thursday
    4: [],
    // Friday
    5: [],
    // Saturday
    6: [],
};
```

Then, we want to get the first and last day in the selected month including the weekday.

```js
const firstDay = new Date(year, month, 1);
const lastDay = new Date(year, month + 1, 0);

const firstDayOfWeek = firstDay.getDay();
const lastDayOfWeek = lastDay.getDay();
```

Then, before we generate the current month, we want to generate the previous month day if needed.

```js
if (firstDayOfWeek !== 0) {
    const prevMonth = getPrevious(month, year);
    for (let i = 1; i <= firstDayOfWeek; i++) {
        let iMap = i - 1;
        if (iMap < 0) iMap = 6;
        const date = prevMonth.getDate() - (firstDayOfWeek - i)
        dayMappings[iMap].push({
            day: date,
            active: false,
        });
    }
}
```

The code will check if the firstDayOfWeek is Sunday, if it's not we will get the previous month which are generated with this:

```js
function getPrevious(month, year) {
    if (month === 0) {
        month = 11;
        year--;
    } else {
        month--;
    }
    return new Date(year, month + 1, 0);
}
```

After that we use loop to get the day backward and add them to the proper day of the week list.

Then we will generate the one for the selected month

```js
for (let i = 1; i <= lastDay.getDate(); i++) {
    const nD = new Date(year, month, i);
    const nDOW = nD.getDay();
    dayMappings[nDOW].push({
        day: i,
        active: true,
    });
}
```

We basically just created new instance of Date for every day, then make sure to set the `active` to true since it will be the "active" selected month day.

Then we can generate the next month day if needed.

```js
if (lastDayOfWeek !== 6) {
    const nextMonth = new Date(year, month + 1, 1);
    for (let i = 1; i <= (6 - lastDayOfWeek); i++) {
        dayMappings[lastDayOfWeek + i].push({
            day: i,
            active: false,
        });
    }
}

return dayMappings;
```

After that, we can start by making our main function that will be called.

```js
function main() {};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}
```

The readyState thing is to check if our website is fully loaded or not, since we dont want to do DOM manipulation when everything is not yet loaded.

After that, inside the main function we can get the current time and date then set the Month and Year on the `DateState` global const.

```js
const currentDate = new Date();
const currentMonth = currentDate.getMonth();
const currentYear = currentDate.getFullYear();
DateState.month = currentMonth;
DateState.year = currentYear;
```

Then, we can get our button to cycle the month then add some click listeners.

```js
const $leftCalBtn = document.querySelector("button.left-cal");
const $rightCalBtn = document.querySelector("button.right-cal");

$leftCalBtn.addEventListener("click", () => {
    DateState.month--;
    if (DateState.month < 0) {
        DateState.month = 11;
        DateState.year--;
    }
    const mappings = generateCalendarTable(DateState.month, DateState.year);
    renderTable(mappings, DateState.month, DateState.year);
});
$rightCalBtn.addEventListener("click", () => {
    DateState.month++;
    if (DateState.month > 11) {
        DateState.month = 0;
        DateState.year++;
    }
    const mappings = generateCalendarTable(DateState.month, DateState.year);
    renderTable(mappings, DateState.month, DateState.year);
});
```

So, if the user click the left/prev one, it will minus the month and check if it's less than zero, if it's we move back the year and set the month to 11 (december). Then we can generate the table and render it.

It's the same for the right/next button, it just check if the month is more than 11 (december), if it's cycle to next year and month.

After that, we want to add another generation and render call after it to render the current month.

```js
const mappings = generateCalendarTable(currentMonth, currentYear);
renderTable(mappings, DateState.month, DateState.year);
```

Now, we need to add `renderTable` function that will act as our renderer.

```js
function renderTable(tableMappings, month, year) {};
```

First, we need to get our calendar element then empty it out.
```js
const table = document.getElementById('calendar');
table.innerHTML = '';
```

Then we want to get the selected date and time using `Date` to render our `November 2022` text for example.

```js
const dt = new Date(year, month, 1);
const monthName = dt.toLocaleString('default', { month: 'long' });
const yearName = dt.toLocaleString('default', { year: 'numeric' });
const monthYear = `${monthName} ${yearName}`;
const monthYearEl = document.querySelector('h2.text-xl');
monthYearEl.textContent = monthYear;
```

Then, we want to get the current time for some check later, and define our week day list.

```js
const currentTime = new Date();
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
```

After that, we can use `Object.keys` to iterate our tableMappings keys

```js
Object.keys(tableMappings).forEach((key, idx) => {
    const weekDay = parseInt(key);
```

Then we can start by creating the week day text

```js
const weekDayEl = document.createElement('div'); // create the base column
weekDayEl.classList.add('flex', 'flex-col', 'gap-2');
const wDayT = days[idx]; // get the week day name from the list
const dayEl = document.createElement('div'); // create the inner element
dayEl.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'px-3', 'py-2', 'w-10', 'h-10', 'rounded-full', 'select-none'); // add some styling
dayEl.innerHTML = `<span class="font-semibold">${wDayT}</span>`;  // add the text
weekDayEl.appendChild(dayEl); // then append it to our base column
```

After that, we can start iterating the table list for each day.

```js
const cY = currentTime.getFullYear();
const cM = currentTime.getMonth();
tableMappings[key].forEach((day) => {
    const cD = currentTime.getDate();
    const dayEl = document.createElement('div'); // generate the inner element
    dayEl.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'px-3', 'py-2', 'rounded-[50%]', 'w-10', 'h-10', 'transition-color', 'duration-100', 'select-none'); // style
    const isCurrent = cY === year && cM === month && cD === day.day; // check if {day} is the current date and time now!
    if (isCurrent) {
        // if it's use purple color
        dayEl.classList.add('bg-purple-600', 'hover:bg-purple-500');
    } else {
        // no? just add hover color
        dayEl.classList.add('hover:bg-gray-500');
    }
    // add text
    dayEl.innerHTML = `<span class="font-semibold">${day.day}</span>`;
    // check if it's "active" state or not
    if (!day.active) {
        // if it's not, make it darker?
        dayEl.classList.add('text-gray-400');
    }
    // add to the base element
    weekDayEl.appendChild(dayEl);
});
```

We want to get the current year and month, then inside the loop we can get the current day. After that, we basically just create our element with some checking (refer to the code).

After that, we can just add our `weekDayEl` to the main `table`

```js
table.appendChild(weekDayEl);
```

And we're done!