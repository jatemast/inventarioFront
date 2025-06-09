<template>
  <div>
    <h2>Agregar Producto</h2>
    <form @submit.prevent="submitProducto">
      <div>
        <label>Nombre:</label>
        <input v-model="producto.nombre" required />
      </div>
      <div>
        <label>Descripción:</label>
        <textarea v-model="producto.descripcion"></textarea>
      </div>
      <div>
        <label>Precio:</label>
        <input type="number" v-model.number="producto.precio" required />
      </div>
      <div>
        <label>Stock:</label>
        <input type="number" v-model.number="producto.stock" required />
      </div>
      <button type="submit">Agregar</button>
    </form>

    <p v-if="mensaje">{{ mensaje }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      producto: {
        nombre: '',
        descripcion: '',
        precio: null,
        stock: null,
      },
      mensaje: ''
    }
  },
  methods: {
    async submitProducto() {
      try {
        const response = await fetch('/api/productos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Si usas autenticación, añade:
            // 'Authorization': 'Bearer ' + tu_token
          },
          body: JSON.stringify(this.producto)
        });

        if (!response.ok) {
          const errorData = await response.json();
          this.mensaje = 'Error: ' + JSON.stringify(errorData);
          return;
        }

        const data = await response.json();
        this.mensaje = 'Producto agregado con ID: ' + data.id;

        // Limpiar formulario
        this.producto = {
          nombre: '',
          descripcion: '',
          precio: null,
          stock: null,
        };
      } catch (error) {
        this.mensaje = 'Error en la petición: ' + error.message;
      }
    }
  }
}
</script>
