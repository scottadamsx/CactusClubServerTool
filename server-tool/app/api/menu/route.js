export async function GET() {
  const menu = [
    { id: 1, name: "Double Double", price: 2.19 },
    { id: 2, name: "Iced Capp", price: 3.49 },
    { id: 3, name: "Boston Cream Donut", price: 1.49 },
  ];
  return Response.json(menu);
}
