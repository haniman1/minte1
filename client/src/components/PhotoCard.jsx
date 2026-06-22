// src/components/ServiceCard.jsx

function ServiceCard({ title, price, description, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 cursor-pointer hover:scale-105 transition"
    >
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="text-yellow-400 font-semibold mt-1">{price}</p>
      <p className="text-gray-400 text-sm mt-2">{description}</p>
    </div>
  );
}

export default ServiceCard;
