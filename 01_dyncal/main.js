(function(){
    const DateState = {
        month: -1,
        year: -1,
    };

    function getPrevious(month, year) {
        if (month === 0) {
            month = 11;
            year--;
        } else {
            month--;
        }
        return new Date(year, month + 1, 0);
    }

    function generateCalendarTable(month, year) {
        /*
            {
                day: 1,
                month: 0,
                active: true, // true if selected month
            }
        */
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

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const firstDayOfWeek = firstDay.getDay();
        const lastDayOfWeek = lastDay.getDay();

        if (firstDayOfWeek !== 0) {
            const prevMonth = getPrevious(month, year);
            for (let i = 1; i <= firstDayOfWeek; i++) {
                let iMap = i - 1;
                if (iMap < 0) iMap = 6;
                const date = prevMonth.getDate() - (firstDayOfWeek - i)
                dayMappings[iMap].push({
                    day: date,
                    month: month - 1,
                    active: false,
                });
            }
        }

        // add the current
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const nD = new Date(year, month, i);
            const nDOW = nD.getDay();
            dayMappings[nDOW].push({
                day: i,
                month: month,
                active: true,
            });
        }

        if (lastDayOfWeek !== 6) {
            const nextMonth = new Date(year, month + 1, 1);
            for (let i = 1; i <= (6 - lastDayOfWeek); i++) {
                dayMappings[lastDayOfWeek + i].push({
                    day: i,
                    month: month + 1,
                    active: false,
                });
            }
        }

        return dayMappings;
    }

    /**
     * <div class="flex flex-col gap-2">
                    <div class="flex flex-col items-center justify-center px-3 py-2 w-10 h-10 rounded-full select-none">
                        <span class="font-semibold">Sun</span>
                    </div>
                    <div class="flex flex-col items-center justify-center px-3 py-2 w-10 h-10 rounded-full select-none">
                        <span class="font-semibold">Mon</span>
                    </div>
                    <div class="flex flex-col items-center justify-center px-3 py-2 w-10 h-10 rounded-full select-none">
                        <span class="font-semibold">Tue</span>
                    </div>
                    <div class="flex flex-col items-center justify-center px-3 py-2 w-10 h-10 rounded-full select-none">
                        <span class="font-semibold">Wed</span>
                    </div>
                    <div class="flex flex-col items-center justify-center px-3 py-2 w-10 h-10 rounded-full select-none">
                        <span class="font-semibold">Thu</span>
                    </div>
                    <div class="flex flex-col items-center justify-center px-3 py-2 w-10 h-10 rounded-full select-none">
                        <span class="font-semibold">Fri</span>
                    </div>
                    <div class="flex flex-col items-center justify-center px-3 py-2 w-10 h-10 rounded-full select-none">
                        <span class="font-semibold">Sat</span>
                    </div>
                </div>
     */

    function renderTable(tableMappings, month, year) {
        const table = document.getElementById('calendar');
        table.innerHTML = '';

        const dt = new Date(year, month, 1);
        const monthName = dt.toLocaleString('default', { month: 'long' });
        const yearName = dt.toLocaleString('default', { year: 'numeric' });
        const monthYear = `${monthName} ${yearName}`;
        const monthYearEl = document.querySelector('h2.text-xl');
        monthYearEl.textContent = monthYear;

        const currentTime = new Date();
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        Object.keys(tableMappings).forEach((key, idx) => {
            const weekDay = parseInt(key);

            const weekDayEl = document.createElement('div');
            weekDayEl.classList.add('flex', 'flex-col', 'gap-2');
            const wDayT = days[idx];
            const dayEl = document.createElement('div');
            dayEl.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'px-3', 'py-2', 'w-10', 'h-10', 'rounded-full', 'select-none');
            dayEl.innerHTML = `<span class="font-semibold">${wDayT}</span>`;
            weekDayEl.appendChild(dayEl);

            const cY = currentTime.getFullYear();
            const cM = currentTime.getMonth();
            tableMappings[key].forEach((day) => {
                const cD = currentTime.getDate();
                const dayEl = document.createElement('div');
                dayEl.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'px-3', 'py-2', 'rounded-[50%]', 'w-10', 'h-10', 'transition-color', 'duration-100', 'select-none');
                const isCurrent = cY === year && cM === day.month && cD === day.day;
                if (isCurrent) {
                    dayEl.classList.add('bg-purple-600', 'hover:bg-purple-500');
                } else {
                    dayEl.classList.add('hover:bg-gray-500');
                }
                dayEl.innerHTML = `<span class="font-semibold">${day.day}</span>`;
                if (!day.active) {
                    dayEl.classList.add('text-gray-400');
                }
                weekDayEl.appendChild(dayEl);
            });
            table.appendChild(weekDayEl);
        });
    }

    function main() {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        DateState.month = currentMonth;
        DateState.year = currentYear;

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
        
        const mappings = generateCalendarTable(currentMonth, currentYear);
        renderTable(mappings, DateState.month, DateState.year);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();