const chalk = require("chalk");
const Base = require("inquirer/lib/prompts/base");
const Choices = require("inquirer/lib/objects/choices");
const observe = require("inquirer/lib/utils/events");
const Paginator = require("inquirer/lib/utils/paginator");

const Table = require("cli-table");
const cliCursor = require("cli-cursor");
const figures = require("figures");
const { map, takeUntil } = require("rxjs/operators");
const { vuePlugin } = require("highlight.js");

const placeholder = figures.line

class TablePrompt extends Base {
  /**
   * Initialise the prompt
   *
   * @param  {Object} questions
   * @param  {Object} rl
   * @param  {Object} answers
   */
  constructor(questions, rl, answers) {
    super(questions, rl, answers);

    // this.columns = new Choices(this.opt.columns, []);
    this.pointer = 0; // y 轴坐标
    this.horizontalPointerLength = 0    // x 轴做大长度
    this.horizontalPointer = 0; // x 坐标
    this.rows = (this.opt.rows || []).filter(() => true).map((item) => {
      this.horizontalPointerLength = Math.max(this.horizontalPointerLength, item.value.length)
      return item
    });
    this.rows = this.rows.map(item => {
      for (let i = 0; i < this.horizontalPointerLength; i++){
        if(!item.value[i]){
          item.value[i] = placeholder
        }
      }
      item.checkedIndex = []
      return item
    })

    this.pageSize = this.opt.pageSize || 10;
  }

  /**
   * Start the inquirer session
   *
   * @param  {Function} callback
   * @return {TablePrompt}
   */
  _run(callback) {
    this.done = callback;

    const events = observe(this.rl);
    const validation = this.handleSubmitEvents(
      events.line.pipe(map(this.getCurrentValue.bind(this)))
    );
    validation.success.forEach(this.onEnd.bind(this));
    validation.error.forEach(this.onError.bind(this));

    events.keypress.forEach(({ key }) => {
      switch (key.name) {
        case "left":
          return this.onLeftKey();

        case "right":
          return this.onRightKey();
      }
    });

    events.normalizedUpKey
      .pipe(takeUntil(validation.success))
      .forEach(this.onUpKey.bind(this));
    events.normalizedDownKey
      .pipe(takeUntil(validation.success))
      .forEach(this.onDownKey.bind(this));
    events.spaceKey
      .pipe(takeUntil(validation.success))
      .forEach(this.onSpaceKey.bind(this));

    if (this.rl.line) {
      this.onKeypress();
    }

    cliCursor.hide();
    this.render();

    return this;
  }

  getCurrentValue() {
    const currentValue = [];
    return currentValue;
  }

  onEnd(state) {
    this.status = "answered";
    this.spaceKeyPressed = true;

    this.render();

    this.screen.done();
    cliCursor.show();

    let value = []

    this.rows.map(row => {
      let tagList = row.checkedIndex.map(index => {
        return row.value[index]
      }).filter(tag => {
        if (tag === placeholder) {
          return false
        }
        return true
      })
      if(!tagList.length){
        return
      }
      value.push({
        business: row.name,
        tagList: tagList
      })
    })
    this.done(value);
  }

  onError(state) {
    this.render(state.isValid);
  }

  onLeftKey() {
    const length = this.rows[this.pointer].value.length
    this.horizontalPointer =
      this.horizontalPointer > 0 ? this.horizontalPointer - 1 : length - 1;
    this.render();
  }

  onRightKey() {
    const length = this.rows[this.pointer].value.length
    this.horizontalPointer =
      this.horizontalPointer < length - 1 ? this.horizontalPointer + 1 : 0;
    this.render();
  }

  onSpaceKey() {
    if (this.spaceKeyPressed) {
      let index = this.rows[this.pointer].checkedIndex.indexOf(this.horizontalPointer)
      if (index > -1) {
        this.rows[this.pointer].checkedIndex.splice(index, 1)
      } else {
        this.rows[this.pointer].checkedIndex.push(this.horizontalPointer)
      }
    } else {
      this.spaceKeyPressed = true;
    }
    this.render();
  }

  onUpKey() {
    let pointer = this.pointer > 0 ? this.pointer - 1 : this.pointer;
    this.pointer = pointer
    this.render();
  }

  onDownKey() {
    const length = this.rows.length;
    this.pointer = this.pointer < length - 1 ? this.pointer + 1 : this.pointer;
    this.render();
  }

  paginate() {
    const middleOfPage = Math.floor(this.pageSize / 2);
    const firstIndex = Math.max(0, this.pointer - middleOfPage);
    const lastIndex = Math.min(
      firstIndex + this.pageSize - 1,
      this.rows.length - 1
    );
    const lastPageOffset = this.pageSize - 1 - lastIndex + firstIndex;

    return [Math.max(0, firstIndex - lastPageOffset), lastIndex];
  }

  render(error) {
    let message = this.getQuestion();
    let bottomContent = "";

    if (!this.spaceKeyPressed) {
      message +=
        "(Press " +
        chalk.cyan.bold("<space>") +
        " to select, " +
        chalk.cyan.bold("<Up and Down>") +
        " to move rows, " +
        chalk.cyan.bold("<Left and Right>") +
        " to move columns)";
    }

    const [firstIndex, lastIndex] = this.paginate();
    const head = [
      chalk.reset.dim(
        `业务线`
      )
    ]

    for(let i = 0; i< this.horizontalPointerLength; i++) {
      head.push(chalk.reset.dim('组件标签'))
    }

    const table = new Table({
      head: head
    });

    this.rows.forEach((row, rowIndex) => {
      if (rowIndex < firstIndex || rowIndex > lastIndex) return;

      const columnValues = [];
      row.value.forEach((r, rIndex) => {
        const isSelected =
          this.pointer === rowIndex &&
          this.horizontalPointer === rIndex;
        if (isSelected) {
          if(row.checkedIndex.indexOf(rIndex) > -1 && row.value[rIndex] !== placeholder) {
            columnValues.push(chalk.reset.bold.yellow(`[${r}]`))
          } else {
            columnValues.push(`[${r}]`)
          }
        } else if (row.checkedIndex.indexOf(rIndex) > -1 && row.value[rIndex] !== placeholder){
          columnValues.push(chalk.reset.bold.yellow(r))
        } else {
          columnValues.push(` ${r} `)
        }
      })

      const chalkModifier =
        this.status !== "answered" && this.pointer === rowIndex
          ? chalk.reset.bold.cyan
          : chalk.reset;
      table.push({
        [chalkModifier(row.name)]: columnValues
      });
    });

    message += "\n\n" + table.toString();
    if (error) {
      bottomContent = chalk.red(">> ") + error;
    }
    this.screen.render(message, bottomContent);
  }
}

module.exports = TablePrompt;