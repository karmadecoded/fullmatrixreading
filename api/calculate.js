module.exports = (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { dob } = req.body;
  if (!dob) {
    return res.status(400).json({ error: "Date of birth required" });
  }

  function reduceToMax22(num) {
    while (num > 22) {
      num = num.toString().split("").reduce((s, d) => s + parseInt(d), 0);
    }
    return num;
  }

  const [day, month, year] = dob.split("/").map(Number);
  const A = reduceToMax22(day);
  const B = reduceToMax22(month);
  const C = reduceToMax22(year.toString().split("").reduce((s, d) => s + parseInt(d), 0));
  const D = reduceToMax22(A + B + C);
  const E = reduceToMax22(A + B + C + D);
  const M = reduceToMax22(A + B);
  const N = reduceToMax22(B + C);
  const O = reduceToMax22(C + D);
  const P = reduceToMax22(D + E);
  const Q = reduceToMax22(E + A);
  const M1 = reduceToMax22(A + M);
  const M2 = reduceToMax22(M + B);
  const N1 = reduceToMax22(C + N);
  const N2 = reduceToMax22(B + N);
  const O1 = reduceToMax22(D + O);
  const O2 = reduceToMax22(C + O);
  const P1 = reduceToMax22(E + P);
  const P2 = reduceToMax22(D + P);
  const Q1 = reduceToMax22(A + Q);
  const Q2 = reduceToMax22(E + Q);
  const CENTER = reduceToMax22(A + B + C + D + E);

  res.status(200).json({
    A, B, C, D, E,
    M, N, O, P, Q,
    M1, M2, N1, N2,
    O1, O2, P1, P2,
    Q1, Q2, CENTER
  });
};
