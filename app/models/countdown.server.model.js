const db = require('../../config/db');

exports.getAll = async function(query) {
    let connection = await db.getPool().getConnection();
    connection.changeUser({database : "specials4"});
    const [rows, fields] = await connection.query("SELECT * " + query);
    connection.release();
    return rows;
};
exports.getCount = async function(query) {
    let connection = await db.getPool().getConnection();
    connection.changeUser({database : "specials4"});
    const [rows, fields] = await connection.query("SELECT COUNT(*) AS Total " + query);
    connection.release();
    return rows[0].Total;
};
exports.getDateData = async function() {
    let connection = await db.getPool().getConnection();
    connection.changeUser({database : "specials4"});
    const q = "SELECT STR_TO_DATE(table_name, '%d/%m/%Y') as test, table_name FROM \
        information_schema.tables WHERE table_schema = 'specials' order by test DESC"
    const [rows, fields] = await connection.query(q);
    connection.release();
    return rows;
};
exports.getTypes = async function(query) {
    let connection = await db.getPool().getConnection();
    connection.changeUser({database : "specials4"});
    const [rows, fields] = await connection.query(query);
    connection.release();
    return rows;
};
// exports.getProductsHistory = async function(code) {
//     let connection = await db.getPool().getConnection();
//     connection.changeUser({database : "specials4"});
//     const q = "SELECT date, salePrice, name, brand, salePrice, origPrice, volSize FROM cdProducts JOIN cdPrices ON cdProducts.code = cdPrices.code AND cdPrices.code =" + code
//     const [rows, fields] = await connection.query(q);
//     connection.release();
//     return rows;
// };
exports.getProductsThatAreNotLinked = async function(selection, date, cat1) {
    let connection = await db.getPool().getConnection();
    connection.changeUser({database : "specials4"});

    let query3 = " from cdProducts i INNER JOIN cdPrices p ON i.code = p.code AND p.date > '" + date + "' AND i.type" +
        " = '" + cat1 + "' AND i.code LEFT OUTER JOIN linkedSupermarkets l ON i.code = l.countdownID WHERE " +
        "l.countdownID is null ORDER BY RAND() LIMIT 1 "

    const [rows, fields] = await connection.query(selection + query3);
    connection.release();
    return rows;
};

exports.getProductsHistory = async function(code, cdStoreCode) {
    const q = "SELECT cdProducts.name, cdProducts.brand, cdProducts.volSize, cdPrices.salePrice, cdPrices.date, " +
        "cdPrices.origPrice, cdProducts.image FROM cdProducts JOIN cdPrices ON cdProducts.code = cdPrices.code AND cdProducts.code = '" + code + "' " +
        "Where cdPrices.storeCode = '" + cdStoreCode + "' OR cdPrices.storeCode = '0'"
    let connection = await db.getPool().getConnection();
    connection.changeUser({database : "specials4"});
    const [row2, fields2] = await connection.query(q);
    connection.release();
    return row2;
};

exports.getConnectedProductHistory = async function(location, code, cdStoreCode, psStoreCode) {
    const q = "SELECT psProducts.quantityType, psProducts.name as pakName, psPrices.price, psPrices.date as date2, psProducts.productId," +
        " cdProducts.name, cdProducts.brand, cdProducts.volSize, cdPrices.salePrice, cdPrices.date, cdPrices.origPrice, cdProducts.image" +
        " FROM cdProducts JOIN cdPrices ON cdProducts.code = cdPrices.code AND (cdPrices.storeCode = '" + cdStoreCode +"' OR cdPrices.storeCode = '0')" +
        " AND cdProducts.code = '" + code + "' JOIN linkedSupermarkets on cdPrices.code = linkedSupermarkets.countdownID LEFT JOIN" +
        " psPrices ON linkedSupermarkets.pakNsaveID = psPrices.productId AND psPrices.date = cdPrices.date AND psPrices.store" +
        " = '" + psStoreCode + "' LEFT JOIN psProducts ON psPrices.productId = psProducts.productId"  +
        " UNION" +
        " SELECT psProducts.quantityType, psProducts.name, psPrices.price, psPrices.date, psProducts.productId," +
        " cdProducts.name, cdProducts.brand, cdProducts.volSize, cdPrices.salePrice, cdPrices.date, cdPrices.origPrice, cdProducts.image" +
        " FROM psProducts JOIN psPrices ON psPrices.productId = psProducts.productId JOIN linkedSupermarkets on" +
        " psProducts.productId = linkedSupermarkets.pakNsaveID JOIN cdProducts ON linkedSupermarkets.countdownID = cdProducts.code" +
        " AND cdProducts.code = '" + code + "' AND psPrices.store = '" + psStoreCode + "' LEFT JOIN cdPrices ON cdProducts.code = cdPrices.code AND" +
        " cdPrices.date = psPrices.date" +
        " ORDER BY COALESCE(date, date2)"
    let connection = await db.getPool().getConnection();
    connection.changeUser({database : "specials4"});
    const [row2, fields2] = await connection.query(q);
    connection.release();
    return row2;
};
