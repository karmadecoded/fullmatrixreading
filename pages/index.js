// Check if user already used calculator
const checkIfUsed = async (userId) => {
  const res = await fetch(`/api/use-calculator?userId=${userId}`);
  const data = await res.json();
  return data.hasUsed;
};

// Save calculation results
const saveCalculation = async (userId, calculationData) => {
  const res = await fetch("/api/save-calculation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, calculationData }),
  });
  return res.json();
};
