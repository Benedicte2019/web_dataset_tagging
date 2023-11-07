import tableCsv from "./middleware/tableCsv";

const tableRoot = document.querySelector("#csvRoot");
const tableCsv = new tableCsv(tableRoot);

tableCsv.setHeader(["ID", "Name", "Age"])