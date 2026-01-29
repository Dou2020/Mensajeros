# 🏛️ Iglesia Sinai Retalhuleu - Website Oficial

Sitio web oficial de la Iglesia Presbiteriana Sinai en Retalhuleu, Guatemala. Una plataforma moderna y completa para conectar con nuestra comunidad cristiana, compartir información sobre ministerios, células, eventos y actividades.

## 🚀 Tecnologías Utilizadas

- **Astro** - Framework web moderno para sitios estáticos y dinámicos
- **Tailwind CSS** - Framework CSS utilitario para diseño responsivo
- **Flowbite** - Componentes UI basados en Tailwind CSS
- **Notion API** - Integración con Notion para gestión de contenido
- **Cloudflare Pages** - Hosting y despliegue automático

## 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/usuario/iglesia-sinai-website.git

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 🏗️ Estructura del Proyecto

```text
/
├── public/
│   ├── icono.png
│   └── icono_positivo.png
├── src/
│   ├── assets/
│   │   ├── carrucel_mensajeros[1-10].jpg    # Imágenes del carrusel
│   │   ├── celula_*.png                     # Logos de células
│   │   ├── galery_mensajeros[1-12].jpg      # Galería de fotos
│   │   ├── jueves.png, lunes.png, etc.     # Días de la semana
│   │   ├── Sinai.jpg                        # Logo principal
│   │   ├── Jovenes_Directiva/               # Iconos directiva jóvenes
│   │   │   ├── pastor.png
│   │   │   ├── presidente.png
│   │   │   ├── secretaria.png
│   │   │   └── ...
│   │   └── publicidad/                      # Material promocional
│   ├── components/
│   │   ├── navbar.astro                     # Barra de navegación
│   │   ├── carruselMensajero.astro         # Carrusel de imágenes
│   │   ├── galeriaMensajero.astro          # Galería de fotos
│   │   ├── listCelula.astro                # Lista de células
│   │   ├── eventCard.astro                 # Tarjetas de eventos
│   │   ├── Inicio/
│   │   │   └── content.astro               # Contenido página principal
│   │   └── Ministerios/
│   │       ├── Jovenes/                    # Componentes de jóvenes
│   │       └── Ichtus/                     # Componentes otros ministerios
│   ├── layouts/
│   │   ├── Layout.astro                    # Layout principal
│   │   └── footer.astro                    # Pie de página
│   ├── pages/
│   │   ├── index.astro                     # Página de inicio
│   │   ├── Celulas.astro                   # Información de células
│   │   ├── Mensajeros.astro                # Página de mensajeros
│   │   ├── SemanaOracion.astro             # Semana de oración
│   │   ├── Eventos/
│   │   │   ├── index.astro                 # Lista de eventos
│   │   │   └── [id].astro                  # Detalle de evento
│   │   ├── Familiar/                       # Ministerio familiar
│   │   └── Ministerios/
│   │       └── jovenes.astro               # Sociedad de jóvenes
│   ├── utils/
│   │   ├── notion.ts                       # Integración con Notion API
│   │   └── format.ts                       # Utilidades de formato
│   └── env.d.ts
├── astro.config.mjs                        # Configuración de Astro
├── tailwind.config.mjs                     # Configuración de Tailwind
├── tsconfig.json                           # Configuración TypeScript
├── wrangler.jsonc                          # Configuración Cloudflare
└── package.json
```

## ✨ Características Principales

### 🏠 **Página Principal**
- Hero section con información de bienvenida
- Carrusel de imágenes de la iglesia
- Información sobre horarios de servicios
- Enlaces a redes sociales y contacto

### 👥 **Ministerios**
- **Sociedad de Jóvenes**: Directiva completa con nombres y responsabilidades
- **Ministerio Familiar**: Actividades para toda la familia
- **Ichtus**: Otros ministerios especializados

### 🏘️ **Células**
- Lista completa de 18 células con:
  - Logos personalizados
  - Días y horarios de reunión
  - Información de líderes
  - Ubicaciones

### 📅 **Eventos**
- Integración con Notion API para gestión dinámica
- Páginas detalladas de cada evento
- Sistema de filtrado y búsqueda
- Información actualizada automáticamente

### 🙏 **Semana de Oración**
- Cronograma semanal de actividades
- Horarios específicos por día
- Temas y enfoques especiales

## 🎨 Diseño y UX

- **Diseño Responsivo**: Optimizado para móvil, tablet y desktop
- **Modo Oscuro**: Soporte completo para tema claro/oscuro
- **Animaciones Suaves**: Transiciones y efectos hover
- **Accesibilidad**: Cumple estándares web de accesibilidad
- **SEO Optimizado**: Meta tags y estructura semántica

## 🔧 Comandos Disponibles

| Comando | Acción |
|---------|--------|
| `npm install` | Instala todas las dependencias |
| `npm run dev` | Inicia servidor de desarrollo en `localhost:4321` |
| `npm run build` | Construye el sitio para producción en `./dist/` |
| `npm run preview` | Previsualiza la build localmente |
| `npm run astro ...` | Ejecuta comandos CLI de Astro |
| `npm run astro -- --help` | Muestra ayuda del CLI de Astro |

## 🌐 Despliegue

El sitio está configurado para desplegarse automáticamente en **Cloudflare Pages**:

1. Cada push a `main` activa el build automático
2. La configuración está en `wrangler.jsonc`
3. Variables de entorno para Notion API se configuran en Cloudflare

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
NOTION_TOKEN=tu_notion_integration_token
NOTION_DATABASE_ID=tu_database_id
```

## 📱 Integración con Notion

El sitio utiliza Notion como CMS para gestionar:
- **Eventos**: Fechas, descripciones, imágenes
- **Anuncios**: Información actualizable
- **Contenido Dinámico**: Fácil edición sin código

### Configuración de Notion:
1. Crear integración en Notion
2. Configurar base de datos con propiedades necesarias
3. Compartir base de datos con la integración
4. Configurar variables de entorno

## 🤝 Contribuciones

1. Fork del repositorio
2. Crear rama para nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE.md](LICENSE.md) para más detalles.

## 📞 Contacto

- **Iglesia**: Iglesia Presbiteriana Sinai
- **Ubicación**: Retalhuleu, Guatemala
- **Facebook**: [@iglesiapresbiterianasinai.reu](https://www.facebook.com/iglesiapresbiterianasinai.reu)
- **Website**: [iglesiasinai.org](https://iglesiasinai.org)

## 🙏 Agradecimientos

- A toda la congregación de Iglesia Sinai
- A los líderes de células y ministerios
- A la comunidad de desarrolladores de Astro
- A todos los que contribuyen al proyecto

---

**Desarrollado con ❤️ para la Gloria de Dios**
