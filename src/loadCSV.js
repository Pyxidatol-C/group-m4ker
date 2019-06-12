function csv2promo(csv) {
  let promo = [];
  let iName, iGender, iLeader, iBio, iChm, iPhy;
  let rows = csv.split("\n");
  let headers = rows[0].split(",");

  const genders = new Set(),
      leaderLvls = new Set(),
      bioLvls = new Set(),
      chmLvls = new Set(),
      phyLvls = new Set();

  for (const [i, header_] of headers.entries()) {
    const header = header_.replace(/ /g, "").toUpperCase();
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

  for (const row of rows.slice(1)) {
    const info = row.split(",");
    promo.push({
      name: info[iName],
      gender: info[iGender],
      leader: info[iLeader],
      bio: info[iBio],
      chm: info[iChm],
      phy: info[iPhy],
    });

    genders.add(info[iGender]);
    leaderLvls.add(info[iLeader]);
    bioLvls.add(info[iBio]);
    chmLvls.add(info[iChm]);
    phyLvls.add(info[iPhy]);
  }

  if (genders.size !== 2) {
    console.log(`Did not expect genders: ${Array.from(genders)}`);
  }
  if (leaderLvls.size !== 2) {
    console.log(`Did not expect leadership values: ${Array.from(leaderLvls)}`);
  }
  if (bioLvls.size !== 3) {
    console.log(`Did not expect biology level values: ${Array.from(bioLvls)}`);
  }
  if (chmLvls.size !== 3) {
    console.log(`Did not expect chemistry level values: ${Array.from(chmLvls)}`);
  }
  if (phyLvls.size !== 3) {
    console.log(`Did not expect physics level values: ${Array.from(phyLvls)}`);
  }

  return promo;
}

export default csv2promo;