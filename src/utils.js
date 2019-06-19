import {sha256} from 'js-sha256';

async function hash(s) {
  return sha256(s);
}

export default hash;