export default class {
    /**
     * 
     * @param {HTML TableElement} root The table element which displays the CSV data
     */
    constructor(root) {
        this.root = root;
    }

    setHeader(headerColumns) {
        this.root.insertAdjacentHTML("afterbegin", `
            <thead>
                ${headerColumns.map(text => `<th>${text}</th>`).join("")}
            </thead>
        `)
    }
}