import EditMenuItemForm from "./EditMenuItemForm";

export default function MenuItemCard({ item, isEditing, onEdit, onClose, onDelete }) {
  return (
    <li className="flex flex-col gap-2 border rounded p-2">
      {isEditing ? (
        <EditMenuItemForm item={item} onClose={onClose} />
      ) : (
        <div className="flex justify-between items-center">
          <span className="text-lg text-foreground/90">{item.name} — ${item.price}</span>
          <div className="flex gap-2">
            <button onClick={onEdit} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
              Edit
            </button>
            <button onClick={onDelete} className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
