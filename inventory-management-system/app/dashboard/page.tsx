import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bell, LogOut, Settings } from "lucide-react"

// Sample inventory data
const inventory = [
  { id: 1, name: "Product A", category: "Electronics", quantity: 10, price: 99.99 },
  { id: 2, name: "Product B", category: "Clothing", quantity: 20, price: 24.99 },
  { id: 3, name: "Product C", category: "Books", quantity: 5, price: 14.99 },
  { id: 4, name: "Product D", category: "Electronics", quantity: 15, price: 79.99 },
  // Add more inventory items as needed
]

export default function InventoryDashboard() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header Navbar */}
      <header className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold tracking-tight">Electrical Switchgear Limited</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Avatar>
            <AvatarImage src="/avatar.jpg" alt="User Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Button variant="destructive" size="sm">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="flex flex-col gap-6 p-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold tracking-tight">Inventory Dashboard</h2>
          <div className="flex gap-4">
            <Input type="search" placeholder="Search inventory..." />
            <Button>Add New Item</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}