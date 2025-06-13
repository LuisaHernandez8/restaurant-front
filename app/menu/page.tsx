"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Edit, Plus, Search, Trash } from "lucide-react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { getDishes, createDish, Dish, CreateDishDTO, updateDish, deleteDish } from "@/api/dishes"

export default function MenuPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [menuItems, setMenuItems] = useState<Dish[]>([])

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateDishDTO>()

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: errorsEdit },
  } = useForm<CreateDishDTO>()

  const handleMenuItemSubmit = async (data: CreateDishDTO) => {
    try {
      console.log('Datos del formulario:', data) // Para depuración
      const response = await createDish(data)
      setMenuItems(prev => [response, ...prev])
      toast.success("Plato guardado con éxito")
    setIsDialogOpen(false)
      reset()
    } catch (error) {
      console.error('Error al crear el plato:', error)
      toast.error("Error al crear el plato")
    }
  }

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const dishes = await getDishes()
        setMenuItems(dishes)
      } catch (error) {
        console.error("Error al obtener los platos:", error)
        toast.error("Error al cargar los platos")
      }
    }
    fetchDishes()
  }, [])

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && item.available) ||
      (availabilityFilter === "unavailable" && !item.available)

    return matchesSearch && matchesCategory && matchesAvailability
  })

  const handleEditClick = (dish: Dish) => {
    setSelectedDish(dish)
    setEditValue('name', dish.name)
    setEditValue('category', dish.category)
    setEditValue('price', dish.price)
    setEditValue('available', dish.available)
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = async (data: CreateDishDTO) => {
    if (!selectedDish) return

    // Actualización optimista
    const updatedDish = {
      ...selectedDish,
      ...data
    }
    
    setMenuItems(prevItems => 
      prevItems.map(item => 
        item.id === selectedDish.id ? updatedDish : item
      )
    )

    try {
      await updateDish(selectedDish.id, data)
      toast.success("Plato actualizado exitosamente")
      setIsEditDialogOpen(false)
      resetEdit()
    } catch (error) {
      // Revertir cambios si hay error
      setMenuItems(prevItems => 
        prevItems.map(item => 
          item.id === selectedDish.id ? selectedDish : item
        )
      )

      if (error instanceof Error) {
        toast.error(`Error al actualizar el plato: ${error.message}`)
      } else {
        toast.error("Error inesperado al actualizar el plato")
      }
    }
  }

  const handleDeleteClick = (dish: Dish) => {
    setSelectedDish(dish)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedDish) return

    // Eliminación optimista
    setMenuItems(prevItems => prevItems.filter(item => item.id !== selectedDish.id))

    try {
      await deleteDish(selectedDish.id)
      toast.success("Plato eliminado exitosamente")
      setIsDeleteDialogOpen(false)
    } catch (error) {
      // Revertir cambios si hay error
      setMenuItems(prevItems => [...prevItems, selectedDish])

      if (error instanceof Error) {
        toast.error(`Error al eliminar el plato: ${error.message}`)
      } else {
        toast.error("Error inesperado al eliminar el plato")
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestión de Menú</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Plato
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Plato</DialogTitle>
              <DialogDescription>Complete los detalles para añadir un nuevo plato al menú</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleMenuItemSubmit)}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre del Plato</Label>
                    <Input 
                      id="name" 
                      {...register("name", { required: "El nombre es requerido" })} 
                      placeholder="Nombre del plato" 
                    />
                    {errors.name && (
                      <span className="text-sm text-red-500">{errors.name.message}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select 
                      onValueChange={(value) => setValue("category", value, { shouldValidate: true })}
                      defaultValue=""
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Entrada">Entrada</SelectItem>
                        <SelectItem value="Plato Principal">Plato Principal</SelectItem>
                        <SelectItem value="Postre">Postre</SelectItem>
                        <SelectItem value="Bebida">Bebida</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <span className="text-sm text-red-500">La categoría es requerida</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Precio</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      step="0.01" 
                      {...register("price", { 
                        required: "El precio es requerido",
                        min: { value: 0, message: "El precio debe ser mayor a 0" }
                      })} 
                      placeholder="0.00" 
                    />
                    {errors.price && (
                      <span className="text-sm text-red-500">{errors.price.message}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="available" className="mb-2">
                      Disponibilidad
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="available" 
                        {...register("available")}
                        defaultChecked 
                      />
                      <Label htmlFor="available">Disponible</Label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Guardar Plato</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Menú del Restaurante</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar platos..."
                  className="pl-8 w-full sm:w-[200px] md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Entrada">Entradas</SelectItem>
                  <SelectItem value="Plato Principal">Platos Principales</SelectItem>
                  <SelectItem value="Postre">Postres</SelectItem>
                  <SelectItem value="Bebida">Bebidas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Disponibilidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="available">Disponibles</SelectItem>
                  <SelectItem value="unavailable">No Disponibles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Vista Cuadrícula</TabsTrigger>
          <TabsTrigger value="list">Vista Lista</TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{item.name}</h3>
                    <Badge variant={item.available ? "default" : "destructive"}>
                      {item.available ? "Disponible" : "No Disponible"}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
                    <span>{item.category}</span>
                    <span>${Number(item.price).toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left font-medium">Nombre</th>
                    <th className="p-4 text-left font-medium">Categoría</th>
                    <th className="p-4 text-left font-medium">Precio</th>
                    <th className="p-4 text-left font-medium">Disponibilidad</th>
                    <th className="p-4 text-right font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-4">
                        <p className="font-medium">{item.name}</p>
                      </td>
                      <td className="p-4">{item.category}</td>
                      <td className="p-4">${Number(item.price).toFixed(2)}</td>
                      <td className="p-4">
                        <Badge variant={item.available ? "default" : "destructive"}>
                          {item.available ? "Disponible" : "No Disponible"}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditClick(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Editar Plato</DialogTitle>
            <DialogDescription>Modifique los detalles del plato</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(handleEditSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Nombre del Plato</Label>
                  <Input 
                    id="edit-name" 
                    {...registerEdit("name", { required: "El nombre es requerido" })} 
                    placeholder="Nombre del plato" 
                  />
                  {errorsEdit.name && (
                    <span className="text-sm text-red-500">{errorsEdit.name.message}</span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Categoría</Label>
                  <Select 
                    onValueChange={(value) => setEditValue("category", value, { shouldValidate: true })}
                    defaultValue={selectedDish?.category}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entrada">Entrada</SelectItem>
                      <SelectItem value="Plato Principal">Plato Principal</SelectItem>
                      <SelectItem value="Postre">Postre</SelectItem>
                      <SelectItem value="Bebida">Bebida</SelectItem>
                    </SelectContent>
                  </Select>
                  {errorsEdit.category && (
                    <span className="text-sm text-red-500">La categoría es requerida</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-price">Precio</Label>
                  <Input 
                    id="edit-price" 
                    type="number" 
                    step="0.01" 
                    {...registerEdit("price", { 
                      required: "El precio es requerido",
                      min: { value: 0, message: "El precio debe ser mayor a 0" }
                    })} 
                    placeholder="0.00" 
                  />
                  {errorsEdit.price && (
                    <span className="text-sm text-red-500">{errorsEdit.price.message}</span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-available">Disponibilidad</Label>
                  <Select 
                    onValueChange={(value) => setEditValue("available", value === "true", { shouldValidate: true })}
                    defaultValue={selectedDish?.available ? "true" : "false"}
                  >
                    <SelectTrigger id="edit-available">
                      <SelectValue placeholder="Seleccionar disponibilidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Disponible</SelectItem>
                      <SelectItem value="false">No Disponible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar Cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Diálogo de eliminación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Eliminar Plato</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar el plato {selectedDish?.name}? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
