var fs = require('fs');

let usage = `Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics`

let arguments = process.argv.slice(2);
let command = arguments[0];

if(command === 'help' || arguments.length === 0){
    console.log(usage);
}
else if(command === 'add'){
    if(arguments.length === 3){
        addNewTask(arguments[1], arguments[2]);
    }
    else {
        console.log('Error: Missing tasks string. Nothing added!')
    }
}
else if(command === 'ls'){
    if(fs.existsSync(`${__dirname}/task.txt`)){
        var data = fs.readFileSync(`${__dirname}/task.txt`,
            {encoding:'utf8', flag:'r'}
        );

        data = data.trim();
        data = data.split('\n');

        data.forEach((tasks, i) => {
            tasks = tasks.split(' ')
            var priority = Number(tasks.shift());
            var task = tasks.join(' ');
            console.log(`${i + 1}. ${task} [${priority}]`)
        });

    }
    else {
        console.log(`There are no pending tasks!`);
    }
}
else if(command === 'del'){
    if(arguments.length === 2){
        let index = arguments[1];

        if(fs.existsSync(`${__dirname}/task.txt`)) {
            var data = fs.readFileSync(`${__dirname}/task.txt`,
                {encoding:'utf8', flag:'r'}
            );
    
            data = data.trim();
            data = data.split('\n');
    
            if(index > 0 && index <= data.length){
                data.splice(index - 1, 1);
                console.log(`Deleted task #${index}`)
    
                data = data.join('\n');
                // Delete the task.txt file when no task exist.
                if((data.length === 0)){
                    fs.unlinkSync(`${__dirname}/task.txt`);
                }
                else {
                    fs.writeFile(`${__dirname}/task.txt`, data, function (err) {
                        if (err) throw err;
                    });
                }
            }
            else {
                console.log(`Error: task with index #${index} does not exist. Nothing deleted.`)
            }
        }
        else {
            console.log(`Error: task with index #${index} does not exist. Nothing deleted.`)
        }
    }
    else {
        console.log('Error: Missing NUMBER for deleting tasks.')
    }
}
else if(command === 'done'){
    if(arguments.length === 2){
        let index = arguments[1];
        
        var data = fs.readFileSync(`${__dirname}/task.txt`,
            {encoding:'utf8', flag:'r'}
        );

        data = data.trim();
        data = data.split('\n');

        if(index > 0 && index <= data.length){
            let removed = data.splice(index - 1, 1);  // Removing task that is done from data array.
            removed = removed.toString();            // Storing the removed task so that it can be stored in completed.txt file.
            
            let removedTask = removed.split(' ')
            removedTask.shift();
            removedTask = removedTask.join(' ');

            console.log(`Marked item as done.`);

            fs.appendFile('completed.txt', `${removedTask}\n`, function (err) {
                if (err) throw err;
            });
            
            data = data.join('\n');
            if(data.length >= 1){
                fs.writeFile(`${__dirname}/task.txt`, data, function (err) {
                    if (err) throw err;
                });
            }
            else {
                fs.unlinkSync(`${__dirname}/task.txt`);  // Removing the task.txt file if no pending task remaining.
            }

        }
        else {
            console.log(`Error: no incomplete item with index #${index} exists.`)
        }
    }
    else {
        console.log('Error: Missing NUMBER for marking tasks as done.')
    }
}
else if(command === 'report') {
    if(fs.existsSync(`${__dirname}/task.txt`)) {
        var data = fs.readFileSync(`${__dirname}/task.txt`,         // Reading from task.txt file to display pending task.
            {encoding:'utf8', flag:'r'}
        );
        data = data.trim();
        data = data.split('\n');
        console.log(`Pending : ${data.length}`)

        data.forEach((tasks, i) => {
            tasks = tasks.split(' ')

            var priority = Number(tasks.shift());
            var task = tasks.join(' ');
            console.log(`${i + 1}. ${task} [${priority}]`)
        });
    }
    else {
        console.log('Pending : 0');
    }
    if(fs.existsSync('completed.txt')) {                        // Reading from completed.txt file to display completed task.
        var data = fs.readFileSync('completed.txt',
            {encoding:'utf8', flag:'r'}
        );
        data = data.trim();
        data = data.split('\n');
        console.log(`\nCompleted : ${data.length}`)

        data.forEach((tasks, i) => {
            console.log(`${i + 1}. ${tasks}`)
        });
    }
    else {
        console.log(`\nCompleted : 0`)
    }
}



// Fucntion for different tasks
function addNewTask(priority, task) {

    if(fs.existsSync(`${__dirname}/task.txt`)) {
        var data = fs.readFileSync(`${__dirname}/task.txt`,
            {encoding:'utf8', flag:'r'}
        );
        data = data.trim();
        data = data.split('\n');

        // Reading the content of task.txt file, then pushing the new task to the data array
        // Sorting the data array and then writing to the task.txt file.

        data.push(`${priority} ${task}`)
        data.sort(function compareNumbers(a, b) {
            a = a.split(' ');
            b = b.split(' ');
            if(a[0] - b[0] === 0)
                return 1;
            return a[0] - b[0];
          });

        data = data.join("\n");

        fs.writeFile(`${__dirname}/task.txt`, data, function (err) {
            if (err) throw err;
            console.log(`Added task: "${task}" with priority ${priority}`);
        });
        
        

    }
    else {
        fs.appendFile(`${__dirname}/task.txt`, `${priority} ${task}\n`, function (err) {
            if (err) throw err;
            console.log(`Added task: "${task}" with priority ${priority}`);
        });
    }
}