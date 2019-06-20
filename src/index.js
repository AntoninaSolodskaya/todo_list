import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./styles.css";

function App() {
  const [list, setList] = useState([]);
  const [rootInput, setItem] = useState("");
  const [innerInput, setSublist] = useState("");

  const addToRoot = e => {
    e.preventDefault();

    const newElem = {
      id: Date.now(),
      title: rootInput
    };

    setList([...list, newElem]);
    setItem("");
  };

  const addInnerElem = parentId => {
    let newList = [...list];
    const findElembyId = (arr, elemId, action) => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === elemId) {
          action(arr[i]);
          break;
        }
        if (arr[i].children) {
          findElembyId(arr[i].children, elemId, action);
        }
      }
    };

    const addNewElem = parentElem => {
      if (!parentElem.children) {
        parentElem.children = [];
      }
      setList(newList);
    };

    findElembyId(list, parentId, addNewElem);
  };

  const addElem = parentElem => {
    let newList = [...list];
    const title = innerInput;

    const newElem = {
      id: Date.now(),
      title: title
    };

    parentElem.children.push(newElem);
    setSublist(newList);
    setSublist("");
  };

  const addChildInput = item => {
    if (item.children) {
      return (
        <div>
          <input
            type="text"
            onChange={e => setSublist(e.target.value)}
            value={innerInput}
          />
          <button
            onClick={() => {
              addElem(item);
            }}
          >
            Add
          </button>
        </div>
      );
    }
  };

  const checkSublist = item => {
    if (!item.children) {
      return (
        <button
          type="button"
          className="add"
          onClick={() => addInnerElem(item.id)}
        >
          Add Sublist
        </button>
      );
    }
  };

  const findParentElem = (arr, elemId, action) => {
    if (arr.some(item => item.id === elemId)) {
      action(arr);
    } else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children) {
          findParentElem(arr[i].children, elemId, action);
        }
      }
    }
  };

  const removeElem = id => {
    let newList = [...list];

    const removeElemById = parentArr => {
      const elem = parentArr.find(item => item.id === id);
      const elemIndex = parentArr.indexOf(elem);

      parentArr.splice(elemIndex, 1);
      setList(newList);
    };

    findParentElem(newList, id, removeElemById);
  };

  const moveElem = (id, isUp) => {
    let newList = [...list];

    const moveElemById = parentArr => {
      const elem = parentArr.find(item => item.id === id);
      const elemIndex = parentArr.indexOf(elem);

      if (elemIndex === 0 && isUp) return;
      if (elemIndex === parentArr.length - 1 && !isUp) return;

      parentArr.splice(elemIndex, 1);
      const newIndex = isUp ? elemIndex - 1 : elemIndex + 1;

      parentArr.splice(newIndex, 0, elem);

      setList(newList);
    };

    findParentElem(newList, id, moveElemById);
  };

  const parseList = (item, index) => (
    <li key={index}>
      {item.title}
      {checkSublist(item)}
      {index !== 0 && (
        <button
          type="button"
          onClick={() => moveElem(item.id, true)}
          className="move"
        >
          up
        </button>
      )}
      {index > 0 && (
        <button
          type="button"
          onClick={() => moveElem(item.id)}
          className="move"
        >
          down
        </button>
      )}
      <button
        type="button"
        className="remove"
        onClick={() => removeElem(item.id)}
      >
        Remove
      </button>
      {item.children && item.children.length >= 0 && (
        <ul>
          {addChildInput(item)}
          {item.children.map(parseList)}
        </ul>
      )}
    </li>
  );

  return (
    <div className="App">
      <div className="list-wrap">
        {list.length > 0 && <ul>{list.map(parseList)}</ul>}
      </div>
      <header className="App-header">
        <div className="main">
          <form onSubmit={e => addToRoot(e)}>
            <input value={rootInput} onChange={e => setItem(e.target.value)} />
            <button className="add">Add</button>
          </form>
        </div>
      </header>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
