const csv = require('csvtojson');

async function csv2promo(c) {
  const rows = await csv({
    output: "json",
  }).fromString(c);

  let promo = [];
  let iName, iGender, iLeader, iBio, iChm, iPhy;
  let headers = Object.keys(rows[0]);

  for (const i of headers) {
    const header = i.replace(/ /g, "").toUpperCase();
    if (header.includes("NAME") || header.includes("STUDENT")) {
      iName = iName || i;
    } else if (header.includes("GENDER") || header.includes("M/F")) {
      iGender = iGender || i;
    } else if (header.includes("LEADER")) {
      iLeader = iLeader || i;
    } else if (header.includes("BIO")) {
      iBio = iBio || i;
    } else if (header.includes("CHM")) {
      iChm = iChm || i;
    } else if (header.includes("PHY")) {
      iPhy = iPhy || i;
    }
  }

  for (const info of rows) {

    promo.push({
      name: info[iName],
      gender: info[iGender],
      leader: info[iLeader],
      bio: info[iBio],
      chm: info[iChm],
      phy: info[iPhy],
    });
  }

  return promo;
}

export default csv2promo;