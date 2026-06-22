import Package from "../models/Package.js";

// Get all packages (Public)

export const getPackages = async (req, res) => {
  try {
    const packages = await Package.find({ active: true }).sort({ price: 1 });

    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create Package (Admin Only)
export const createPackage = async (req, res) => {
  try {
    const { name, price, description, features, popular } = req.body;

    const newPackage = await Package.create({
      name,
      price,
      description,
      features: features || [],
      popular: popular || false,
      active: true,
    });

    // IMPORTANT: return ONLY object
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Package (Admin Only)
export const updatePackage = async (req, res) => {
  try {
    const updatedPackage = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    // IMPORTANT: return ONLY object
    res.json(updatedPackage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Package (Admin Only)
export const deletePackage = async (req, res) => {
  try {
    const deleted = await Package.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
