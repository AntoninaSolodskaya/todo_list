import React, { Fragment } from "react";

function List() {
  state = {
    list: [],
    rootInput: "",
    innerInput: ""
  };

  setRootInput = e => {
    this.setState({ rootInput: e.target.value });
  };

  setInnerInput = e => {
    this.setState({ innerInput: e.target.value });
  };

  addToRoot = e => {
    e.preventDefault();

    const newElem = {
      id: Date.now(),
      title: this.state.rootInput
    };

    this.setState({
      list: [...list, newElem],
      rootInput: ""
    });
  };

  addInnerElem = parentId => {
    let list = [...list];

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
      this.setState({ list });
    };

    findElembyId(list, parentId, addNewElem);
  };

  addElem = parentElem => {
    const title = this.state.innerInput;

    const newElem = {
      id: Date.now(),
      title: title
    };

    parentElem.children.push(newElem);
    this.setState({
      innerInput: ""
    });
  };

  addChildInput = item => {
    if (item.children) {
      return (
        <Fragment>
          <input
            type="text"
            onChange={e => this.setInnerInput(e)}
            value={this.state.innerInput}
          />
          <button
            onClick={e => {
              this.addElem(item);
            }}
          >
            Add
          </button>
        </Fragment>
      );
    }
  };

  checkSublist = (item, index) => {
    if (!item.children) {
      return (
        <button
          type="button"
          className="add"
          onClick={() => this.addInnerElem(item.id)}
        >
          Add Sublist
        </button>
      );
    }
  };

  findParentElem = (arr, elemId, action) => {
    if (arr.some(item => item.id === elemId)) {
      action(arr);
    } else {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children) {
          this.findParentElem(arr[i].children, elemId, action);
        }
      }
    }
  };

  removeElem = id => {
    let list = [...list];

    const removeElemById = parentArr => {
      const elem = parentArr.find(item => item.id === id);
      const elemIndex = parentArr.indexOf(elem);

      parentArr.splice(elemIndex, 1);
      this.setState({ list });
    };

    this.findParentElem(list, id, removeElemById);
  };

  moveElem = (id, isUp) => {
    let list = [...list];

    const moveElemById = parentArr => {
      const elem = parentArr.find(item => item.id === id);
      const elemIndex = parentArr.indexOf(elem);

      if (elemIndex === 0 && isUp) return;
      if (elemIndex === parentArr.length - 1 && !isUp) return;

      parentArr.splice(elemIndex, 1);
      const newIndex = isUp ? elemIndex - 1 : elemIndex + 1;

      parentArr.splice(newIndex, 0, elem);

      this.setState({ list });
    };

    this.findParentElem(list, id, moveElemById);
  };

  parseList = (item, index) => (
    <li key={index}>
      {item.title}
      {this.checkSublist(item, index)}
      {index !== 0 && (
        <button
          type="button"
          onClick={() => this.moveElem(item.id, true)}
          className="move"
        >
          up
        </button>
      )}
      {index > 0 && (
        <button
          type="button"
          onClick={() => this.moveElem(item.id)}
          className="move"
        >
          down
        </button>
      )}
      <button
        type="button"
        className="remove"
        onClick={() => this.removeElem(item.id)}
      >
        Remove
      </button>
      {item.children && item.children.length >= 0 && (
        <ul>
          {this.addChildInput(item)}
          {item.children.map(this.parseList)}
        </ul>
      )}
    </li>
  );

    return (
      <div className="App">
        <div className="list-wrap">
          {list.length > 0 && (
            <ul>{list.map(this.parseList)}</ul>
          )}
        </div>
        <header className="App-header">
          <div className="main">
            <form onSubmit={e => this.addToRoot(e)}>
              <input value={rootInput} onChange={e => this.setRootInput(e)} />
              <button className="add">Add</button>
            </form>
          </div>
        </header>
      </div>
    );
  }
}

export default List;
