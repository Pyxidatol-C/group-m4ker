import hash from './utils';

function getStatsOf(ids, promo) {
  let nbM = 0, nbF = 0;
  let nbSL = 0, nbHL = 0;
  let nbLeader = 0;

  const subjCnts = {bio: 0, chm: 0, phy: 0};

  for (const id of ids) {
    const s = promo[id];
    if (s.gender === "M") nbM++; else if (s.gender === "F") nbF++;

    for (const subj of Object.keys(subjCnts)) {
      if (s[subj]) {
        subjCnts[subj]++;
        if (s[subj] === "SL") nbSL++; else if (s[subj] === "HL") nbHL++;
      }
    }

    if (s.leader) nbLeader++;
  }

  return {
    nbM, nbF,
    ...subjCnts,
    nbSL, nbHL,
    nbLeader
  };
}


function evaluateGroupsUsingAvg(groups, promo) {
  const promoStats = getStatsOf([...Array(promo.length).keys()], promo);
  const nbGroups = groups.length;
  let score = 0;
  for (const g of groups) {
    const groupStats = getStatsOf(g, promo);
    score += Math.abs(groupStats.nbM - promoStats.nbM / nbGroups);
    score += Math.abs(groupStats.nbF - promoStats.nbF / nbGroups);
    score += Math.abs(groupStats.nbLeader - promoStats.nbLeader / nbGroups);
    score += Math.abs(groupStats.bio - promoStats.bio / nbGroups);
    score += Math.abs(groupStats.chm - promoStats.chm / nbGroups);
    score += Math.abs(groupStats.phy - promoStats.phy / nbGroups);
    score += Math.abs(groupStats.nbSL - promoStats.nbSL / nbGroups);
    score += Math.abs(groupStats.nbHL - promoStats.nbHL / nbGroups);

  }

  return -score;
}

function evaluateGroupsUsingDiff(groups, promo) {
  let score = 0;

  for (let i = 0; i < groups.length; i++) {
    for (let j = 0; j < i; j++) {
      const s1 = getStatsOf(groups[i], promo);
      const s2 = getStatsOf(groups[j], promo);

      score += Math.abs(s1.nbM - s2.nbM);
      score += Math.abs(s1.nbF - s2.nbF);
      score += Math.abs(s1.nbLeader - s2.nbLeader);
      score += Math.abs(s1.bio - s2.bio);
      score += Math.abs(s1.chm - s2.chm);
      score += Math.abs(s1.phy - s2.phy);
      score += Math.abs(s1.nbSL - s2.nbSL);
      score += Math.abs(s1.nbHL - s2.nbHL);
    }
  }

  return -score;
}

// Fisher-Yates algorithm
// copied from https://stackoverflow.com/a/6274381/6597726
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}


async function makeGroups(promo, nbGroups) {
  // Make groups
  const nbStudents = promo.length;
  const ids = [...Array(nbStudents).keys()];
  shuffle(ids);
  const groups = [];
  for (let i = 0; i < nbGroups; i++) {
    groups.push([]);
  }
  for (let j = 0; j < nbStudents; j++) {
    groups[j % nbGroups].push(ids[j]);
  }

  // Test swaps
  let score = evaluateGroupsUsingDiff(groups, promo);
  let swap = {a: 0, b: 0, x: 0, y: 0};
  let scores = [score];

  while (true) {
    for (let a = 0; a < nbGroups; a++) {
      for (let b = 0; b < a; b++) {
        for (let x = 0; x < groups[a].length; x++) {
          for (let y = 0; y < groups[b].length; y++) {
            [groups[a][x], groups[b][y]] = [groups[b][y], groups[a][x]];  // no bj hehehe
            let score0 = evaluateGroupsUsingDiff(groups, promo);
            if (score0 > score) {
              score = score0;
              swap = {a, b, x, y};
            }
            [groups[a][x], groups[b][y]] = [groups[b][y], groups[a][x]];
          }
        }
      }
    }

    if (score > scores[scores.length - 1]) {
      console.log(score);
      scores.push(score);
      const {a, b, x, y} = swap;
      [groups[a][x], groups[b][y]] = [groups[b][y], groups[a][x]];
    } else {
      console.log(evaluateGroupsUsingAvg(groups, promo));
      const key = await hash(JSON.stringify(promo));
      return {
        key,
        groups,
      };
    }
  }
}


export default makeGroups;