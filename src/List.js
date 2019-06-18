import React from "react";

class List extends React.Component {
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
      list: [...this.state.list, newElem],
      rootInput: ""
    });

    console.log("newElem", newElem);
    console.log("list", this.state.list);
  };

  addInnerElem = parentId => {
    const title = this.state.innerInput;
    let list = [...this.state.list];

    const findElembyId = (arr, elemId, action) => {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === elemId) {
          action(arr[i]);
          console.log("arr[i].id", arr[i].id);
          console.log("elemId", elemId);
          break;
        }
        if (arr[i].children) {
          findElembyId(arr[i].children, elemId, action);
          console.log(arr[i].children);
        }
      }
    };

    const addElem = parentElem => {
      const newElem = {
        id: Date.now(),
        title: title
      };

      console.log("newElem", newElem);

      if (!parentElem.children) {
        parentElem.children = [];
      }
      parentElem.children.push(newElem);
      this.setState({ list });
    };

    console.log("parentId", parentId);
    console.log("list", this.state.list);
    findElembyId(list, parentId, addElem);
  };

  removeElem = id => {
    let list = [...this.state.list];

    const findParentElem = (arr, elemId, action) => {
      if (arr.some(item => item.id === elemId)) {
        action(arr);
        console.log("action", arr);
      } else {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children) {
            findParentElem(arr[i].children, elemId, action);
          }
        }
      }
    };

    const removeElemById = parentArr => {
      const elem = parentArr.find(item => item.id === id);
      const elemIndex = parentArr.indexOf(elem);

      parentArr.splice(elemIndex, 1);
      this.setState({ list });
    };

    findParentElem(list, id, removeElemById);
  };

  parseList = (item, index) => (
    <li key={index}>
      {item.title}
      <button
        type="button"
        className="add"
        onClick={() => this.addInnerElem(item.id)}
      >
        Add Sublist
      </button>
      <button
        type="button"
        className="remove"
        onClick={() => this.removeElem(item.id)}
      >
        Remove
      </button>
      <div className="title-wrap">
        <input
          value={this.state.innerInput}
          onChange={e => this.setInnerInput(e)}
        />
      </div>

      {item.children && item.children.length > 0 && (
        <ul>{item.children.map(this.parseList)}</ul>
      )}
    </li>
  );

  render() {
    const { rootInput } = this.state;

    return (
      <div className="App">
        <div className="list-wrap">
          {this.state.list.length > 0 && (
            <ul>{this.state.list.map(this.parseList)}</ul>
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
