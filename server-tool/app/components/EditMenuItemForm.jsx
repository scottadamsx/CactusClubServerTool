import { updateMenuItem } from "@/app/actions/menuActions";

export default function EditMenuItemForm({ item, onClose }) {
  return (
    <form action={updateMenuItem} className="flex flex-col gap-3 border rounded p-4 bg-gray-50">
      <input type="hidden" name="id" defaultValue={item._id.toString()} />
      
      <div>
        <label className="block text-sm font-semibold mb-1">Name</label>
        <input name="name" defaultValue={item.name} className="border rounded p-2 w-full" required />
      </div>
      
      <div>
        <label className="block text-sm font-semibold mb-1">Price</label>
        <input name="price" type="number" step="0.01" defaultValue={item.price} className="border rounded p-2 w-full" required />
      </div>
      
      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white rounded p-2 flex-1 hover:bg-blue-700">Save</button>
        <button type="button" onClick={onClose} className="bg-gray-400 text-white rounded p-2 flex-1 hover:bg-gray-500">Cancel</button>
      </div>
    </form>
  );
}
