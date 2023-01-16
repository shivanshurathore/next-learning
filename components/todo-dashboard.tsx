import styles from "@/styles/todo.module.css";
import { useEffect, useState } from "react";

export default function TODODashBoard() {
  const [todoList, setTodoList] = useState<any[]>([]);
  const [todoListToShow, setTodoListToShow] = useState<any[]>(todoList);
  const [todoLeftCounter, setTodoLeftCounter] = useState<number>(
    todoList.length
  );
  const [showInputBoxIndex, setShowInputBoxIndex] = useState(-1);
  const [selectedLink, setSelectedLink] = useState<string>("All");

  useEffect(() => {
    const todoList = localStorage.getItem("todoList");
    const todoListArr = JSON.parse(todoList || "[]");

    if (todoListArr?.length) {
      setTodoList(todoListArr);
      setTodoListToShow(todoListArr);

      const filteredArr = todoListArr.filter(
        (todo: { isCompleted: any }) => !todo.isCompleted
      );
      setTodoLeftCounter(filteredArr.length);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(todoList));

    const filteredArr = todoList.filter(
      (todo: { isCompleted: any }) => !todo.isCompleted
    );
    setTodoLeftCounter(filteredArr.length);
  }, [todoList]);

  const addNewTODO = (e: any) => {
    if (e.code === "Enter") {
      todoList.push({ value: e.target.value, isCompleted: false });
      setTodoList((prev) => [...prev]);
      setTodoListToShow(todoList);
      e.target.value = "";
      setTodoLeftCounter(todoList.length);
    }
  };

  const editTODO = (e: any, index: number) => {
    todoList[index].value = e.target.value;
    setTodoList((prev) => [...prev]);
    setTodoListToShow(todoList);
    e.target.value = "";
    if (e.code === "Enter") {
      setShowInputBoxIndex(-1);
    }
  };

  const deleteTODO = (index: number) => {
    todoList.splice(index, 1);
    setTodoList((prev) => [...prev]);
    setTodoListToShow(todoList);
  };

  const handleCompleted = (index: number) => {
    todoList[index].isCompleted = !todoList[index].isCompleted;
    setTodoList((prev) => [...prev]);
    setTodoListToShow(todoList);

    if (todoList[index].isCompleted) {
      setTodoLeftCounter((prev) => prev - 1);
    } else {
      setTodoLeftCounter((prev) => prev + 1);
    }
  };

  const handleFilter = (text: string) => {
    if (text === "Active") {
      const arr = todoList.filter((todo) => !todo.isCompleted);
      setTodoListToShow(arr);
      setSelectedLink("Active");
    } else if (text === "Completed") {
      const arr = todoList.filter((todo) => todo.isCompleted);
      setTodoListToShow(arr);
      setSelectedLink("Completed");
    } else {
      setTodoListToShow(todoList);
      setSelectedLink("All");
    }
  };

  const clearCompleted = () => {
    const completedArr = todoList.filter((todo) => todo.isCompleted);

    if (
      confirm(
        `Are you sure you want to delete all your ${completedArr.length} completed tasks!`
      )
    ) {
      const arr = todoList.filter((todo) => !todo.isCompleted);
      setTodoList(arr);
      setTodoListToShow(arr);
    }
  };

  const handleDoubleClick = (index: number) => {
    setShowInputBoxIndex(index);
  };

  const handleSelectAll = () => {
    const index = todoList.findIndex((todo) => !todo.isCompleted);
    if (index === -1) {
      todoList.forEach((todo) => (todo.isCompleted = false));
      setTodoList([...todoList]);
      setTodoListToShow([...todoList]);
    } else {
      todoList.forEach((todo) => (todo.isCompleted = true));
      setTodoList([...todoList]);
      setTodoListToShow([...todoList]);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.flexAlignCenter}>
        <span className={styles.selectAllIcon} onClick={handleSelectAll}>
          &dArr;
        </span>
        <input
          type={"text"}
          className={styles.inputBox}
          placeholder={"What needs to be done?"}
          onChange={addNewTODO}
          onKeyUp={addNewTODO}
        />
      </div>

      <div>
        {todoListToShow.length === 0 ? (
          <div>TODO List is Empty!</div>
        ) : (
          todoListToShow.map((todo, index) =>
            index === showInputBoxIndex ? (
              <div key={index} className={styles.card}>
                <input
                  type={"text"}
                  className={styles.inputBox}
                  value={todo.value}
                  onChange={(e) => editTODO(e, index)}
                  onKeyUp={(e) => editTODO(e, index)}
                />
              </div>
            ) : (
              <div
                key={index}
                className={styles.card}
                onDoubleClick={() => handleDoubleClick(index)}
              >
                <div>
                  <input
                    type={"checkbox"}
                    checked={todo.isCompleted}
                    onChange={() => handleCompleted(index)}
                  />
                  <span className={styles.todoCheckbox}>{todo.value}</span>
                </div>
                <span
                  className={styles.deleteIcon}
                  onClick={() => deleteTODO(index)}
                >
                  X
                </span>
              </div>
            )
          )
        )}
      </div>

      <div>
        <ul className={styles.filterLink}>
          <li
            className={
              selectedLink === "All" ? styles.activeLink : styles.normalLink
            }
            onClick={() => handleFilter("All")}
          >
            All
          </li>
          <li
            className={
              selectedLink === "Active" ? styles.activeLink : styles.normalLink
            }
            onClick={() => handleFilter("Active")}
          >
            Active
          </li>
          <li
            className={
              selectedLink === "Completed"
                ? styles.activeLink
                : styles.normalLink
            }
            onClick={() => handleFilter("Completed")}
          >
            Completed
          </li>
        </ul>

        {todoList.length !== todoLeftCounter && (
          <span className={styles.clearSelected} onClick={clearCompleted}>
            Clear Completed
          </span>
        )}
      </div>

      <div className={styles.countDiv}>
        <div>Total Tasks: {todoList.length}</div>
        <div>Left Tasks: {todoLeftCounter}</div>
        <div>Completed Tasks: {todoList.length - todoLeftCounter}</div>
      </div>
    </div>
  );
}
