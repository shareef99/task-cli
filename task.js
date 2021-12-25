#!/usr/bin/env node

import { readFileSync, appendFileSync, writeFileSync, access } from "fs";

const taskFilePath = "./task.txt";
const completedTaskFilePath = "./completed.txt";

const [, , ...data] = process.argv;

if (data.length === 0) {
    // No arguments were passed, print the help message
    console.log(`$ ./task help
Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics
    `);
}

if (data) {
    const [command, ...args] = data;

    if (command === "help") {
        console.log(`$ ./task help
Usage :-
$ ./task add 2 hello world    # Add a new item with priority 2 and text "hello world" to the list
$ ./task ls                   # Show incomplete priority list items sorted by priority in ascending order
$ ./task del INDEX            # Delete the incomplete item with the given index
$ ./task done INDEX           # Mark the incomplete item with the given index as complete
$ ./task help                 # Show usage
$ ./task report               # Statistics
    `);
    }
    if (command === "add") {
        const [priority, task] = args;

        if (!priority || !task) {
            console.log("Error: Missing tasks string. Nothing added!");
        } else {
            access(taskFilePath, (err) => {
                if (err) {
                    writeFileSync("task.txt", "", "utf8");
                }
                const tasksList = readFileSync("task.txt", "utf8");
                const tasksArray = tasksList.split("\n");
                tasksArray.push(`${priority} ${task}`);
                const tasksStringArray = tasksArray.join("\n");
                writeFileSync("task.txt", tasksStringArray);
                console.log(`Added task: "${task}" with priority ${priority}`);
            });
        }
    }
    if (command === "ls") {
        access(taskFilePath, (err) => {
            if (err) {
                console.log("There are no pending tasks!");
            } else {
                const tasksFile = readFileSync("task.txt", "utf8");
                const tasksArray = tasksFile.split("\n");
                const tasks = tasksArray.map((task) => {
                    const priority = task.substring(0, task.indexOf(" "));
                    const text = task.substring(task.indexOf(" ") + 1);
                    return { priority, text };
                });
                if (tasks.length === 1) {
                    console.log("There are no pending tasks!");
                } else {
                    const sortedTasks = tasks.sort(
                        (a, b) => a.priority - b.priority
                    );
                    sortedTasks.forEach((task, index) => {
                        if (task.priority) {
                            console.log(
                                `${index}. ${task.text} [${task.priority}]`
                            );
                        }
                    });
                }
            }
        });
    }
    if (command === "del") {
        const [index] = args;
        if (!index) {
            console.log("Error: Missing NUMBER for deleting tasks.");
        } else {
            access(taskFilePath, (err) => {
                if (err) {
                    console.log("There are no pending tasks!");
                } else {
                    const tasksFile = readFileSync("task.txt", "utf8");
                    const tasksArray = tasksFile.split("\n");
                    const tasks = tasksArray.map((task, index) => {
                        const priority = task.substring(0, task.indexOf(" "));
                        const text = task.substring(task.indexOf(" ") + 1);
                        return { priority, text, index };
                    });

                    const sortedTasks = tasks
                        .sort((a, b) => a.priority - b.priority)
                        .filter((task) => task.priority);

                    const newTasks = sortedTasks.filter(
                        (task) => task.index !== parseInt(index)
                    );

                    const newTasksStringArray = newTasks.map((task) => {
                        return `${task.priority} ${task.text}`;
                    });

                    writeFileSync("task.txt", newTasksStringArray.join("\n"));
                    console.log(`Deleted task #${index}`);
                }
            });
        }
    }

    if (command === "done") {
        const [index] = args;
        if (!index) {
            console.log("Error: Missing NUMBER for marking tasks as done.");
        } else {
            access(taskFilePath, (err) => {
                if (err) {
                    console.log("There are no pending tasks!");
                } else {
                    const tasksFile = readFileSync("task.txt", "utf8");
                    const tasksArray = tasksFile.split("\n");
                    const tasks = tasksArray.map((task, index) => {
                        const priority = task.substring(0, task.indexOf(" "));
                        const text = task.substring(task.indexOf(" ") + 1);
                        return { priority, text, index };
                    });

                    const sortedTasks = tasks
                        .sort((a, b) => a.priority - b.priority)
                        .filter((task) => task.priority);

                    const newTasks = sortedTasks.filter(
                        (task) => task.index !== parseInt(index)
                    );

                    const newTasksStringArray = newTasks.map((task) => {
                        return `${task.priority} ${task.text}`;
                    });

                    writeFileSync("task.txt", newTasksStringArray.join("\n"));
                    console.log("Marked item as done.");
                }
            });
        }
    }

    if (command === "report") {
        access(taskFilePath, (err) => {
            if (err) {
                console.log("Pending tasks: 0");
            } else {
                const tasksFile = readFileSync("task.txt", "utf8");
                const tasksArray = tasksFile.split("\n");
                const tasks = tasksArray.map((task) => {
                    const priority = task.substring(0, task.indexOf(" "));
                    const text = task.substring(task.indexOf(" ") + 1);
                    return { priority, text };
                });
                const pendingTasks = tasks
                    .sort((a, b) => a.priority - b.priority)
                    .filter((task) => {
                        return task.priority;
                    });

                const pendingTasksStringArray = pendingTasks.map((task) => {
                    return `${task.priority} ${task.text}`;
                });

                console.log(`Pending tasks: ${pendingTasks.length}`);
                pendingTasks.forEach((task, index) => {
                    console.log(
                        `${index + 1}. ${task.text} [${task.priority}]`
                    );
                });
            }
        });

        access(completedTaskFilePath, (err) => {
            if (err) {
                console.log("Completed tasks: 0");
            } else {
                const completedTasksFile = readFileSync(
                    "completed.txt",
                    "utf8"
                );
                const completedTasksArray = completedTasksFile.split("\n");
                const completedTasksObject = completedTasksArray.map((task) => {
                    const priority = task.substring(0, task.indexOf(" "));
                    const text = task.substring(task.indexOf(" ") + 1);
                    return { priority, text };
                });
                const completedTasks = completedTasksObject
                    .sort((a, b) => {
                        a.priority - b.priority;
                    })
                    .filter((task) => {
                        return task.priority;
                    });

                const completedTasksStringArray = completedTasks.map((task) => {
                    return `${task.priority} ${task.text}`;
                });

                console.log(`Completed tasks: ${completedTasks.length}`);
                completedTasks.forEach((task, index) => {
                    console.log(
                        `${index + 1}. ${task.text} [${task.priority}]`
                    );
                });
            }
        });
    }
}
