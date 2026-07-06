insert into public.bolongo_service_categories (slug, name_es, sort_order)
values
  ('llegada-acceso', 'Llegada y acceso', 10),
  ('transporte', 'Transporte', 20),
  ('supermercado-abastecimiento', 'Supermercado y abastecimiento', 30),
  ('limpieza', 'Limpieza', 40),
  ('mantenimiento', 'Mantenimiento', 50),
  ('alimentos-bebidas', 'Alimentos y bebidas', 60),
  ('amenidades', 'Amenidades', 70),
  ('experiencias-locales', 'Experiencias locales', 80),
  ('wellness', 'Wellness', 90),
  ('familia-ninos', 'Familia y niños', 100),
  ('mascotas', 'Mascotas', 110),
  ('emergencias', 'Emergencias', 120),
  ('propietarios', 'Servicios para propietarios', 130)
on conflict (slug) do update
set name_es = excluded.name_es,
    sort_order = excluded.sort_order;

with category_map as (
  select id, slug from public.bolongo_service_categories
)
insert into public.bolongo_services (
  category_id,
  slug,
  name_es,
  requires_quote,
  requires_owner_approval,
  is_urgent_available,
  sort_order
)
values
  ((select id from category_map where slug = 'llegada-acceso'), 'pre-check-in', 'Pre-check-in', false, false, false, 10),
  ((select id from category_map where slug = 'llegada-acceso'), 'registro-invitados', 'Registro de invitados', false, false, false, 20),
  ((select id from category_map where slug = 'llegada-acceso'), 'pase-qr-temporal', 'Pase QR temporal', false, false, false, 30),
  ((select id from category_map where slug = 'llegada-acceso'), 'welcome-setup', 'Welcome setup', true, false, false, 40),
  ((select id from category_map where slug = 'llegada-acceso'), 'guia-llegada', 'Guía de llegada', false, false, false, 50),

  ((select id from category_map where slug = 'transporte'), 'traslado-aeropuerto', 'Traslado aeropuerto', true, false, true, 10),
  ((select id from category_map where slug = 'transporte'), 'chofer-privado', 'Chofer privado', true, false, true, 20),
  ((select id from category_map where slug = 'transporte'), 'van-grupos', 'Van para grupos', true, false, true, 30),
  ((select id from category_map where slug = 'transporte'), 'transporte-local', 'Transporte local', true, false, true, 40),

  ((select id from category_map where slug = 'supermercado-abastecimiento'), 'despensa-antes-llegada', 'Despensa antes de llegada', true, false, false, 10),
  ((select id from category_map where slug = 'supermercado-abastecimiento'), 'farmacia', 'Farmacia', true, false, true, 20),
  ((select id from category_map where slug = 'supermercado-abastecimiento'), 'flores', 'Flores', true, false, false, 30),
  ((select id from category_map where slug = 'supermercado-abastecimiento'), 'bebidas-snacks', 'Bebidas y snacks', true, false, false, 40),
  ((select id from category_map where slug = 'supermercado-abastecimiento'), 'articulos-playa', 'Artículos de playa', true, false, false, 50),

  ((select id from category_map where slug = 'limpieza'), 'limpieza-diaria', 'Limpieza diaria', true, false, false, 10),
  ((select id from category_map where slug = 'limpieza'), 'limpieza-profunda', 'Limpieza profunda', true, false, false, 20),
  ((select id from category_map where slug = 'limpieza'), 'cambio-blancos', 'Cambio de blancos', true, false, false, 30),
  ((select id from category_map where slug = 'limpieza'), 'lavanderia', 'Lavandería', true, false, false, 40),

  ((select id from category_map where slug = 'mantenimiento'), 'aire-acondicionado', 'Aire acondicionado', true, true, true, 10),
  ((select id from category_map where slug = 'mantenimiento'), 'plomeria', 'Plomería', true, true, true, 20),
  ((select id from category_map where slug = 'mantenimiento'), 'electricidad', 'Electricidad', true, true, true, 30),
  ((select id from category_map where slug = 'mantenimiento'), 'internet', 'Internet', true, true, true, 40),
  ((select id from category_map where slug = 'mantenimiento'), 'electrodomesticos', 'Electrodomésticos', true, true, true, 50),
  ((select id from category_map where slug = 'mantenimiento'), 'reporte-danos', 'Reporte de daños', false, true, true, 60),

  ((select id from category_map where slug = 'alimentos-bebidas'), 'chef-privado', 'Chef privado', true, false, false, 10),
  ((select id from category_map where slug = 'alimentos-bebidas'), 'cena-romantica', 'Cena romántica', true, false, false, 20),
  ((select id from category_map where slug = 'alimentos-bebidas'), 'parrillada', 'Parrillada', true, false, false, 30),
  ((select id from category_map where slug = 'alimentos-bebidas'), 'menu-infantil', 'Menú infantil', true, false, false, 40),
  ((select id from category_map where slug = 'alimentos-bebidas'), 'pedido-restaurante-interno', 'Pedido a restaurante interno', true, false, false, 50),
  ((select id from category_map where slug = 'alimentos-bebidas'), 'bebidas-alberca-playa', 'Bebidas para alberca/playa', true, false, false, 60),

  ((select id from category_map where slug = 'amenidades'), 'reserva-camastros', 'Reserva de camastros', false, false, false, 10),
  ((select id from category_map where slug = 'amenidades'), 'reserva-roof-terrace', 'Reserva de roof terrace', false, false, false, 20),
  ((select id from category_map where slug = 'amenidades'), 'reserva-clases', 'Reserva de clases', true, false, false, 30),
  ((select id from category_map where slug = 'amenidades'), 'toallas', 'Toallas', false, false, false, 40),
  ((select id from category_map where slug = 'amenidades'), 'eventos-pequenos', 'Eventos pequeños', true, false, false, 50),

  ((select id from category_map where slug = 'experiencias-locales'), 'tour-islas-marietas', 'Tour Islas Marietas', true, false, false, 10),
  ((select id from category_map where slug = 'experiencias-locales'), 'yate-privado', 'Yate privado', true, false, false, 20),
  ((select id from category_map where slug = 'experiencias-locales'), 'catamaran', 'Catamarán', true, false, false, 30),
  ((select id from category_map where slug = 'experiencias-locales'), 'surf-lessons', 'Surf lessons', true, false, false, 40),
  ((select id from category_map where slug = 'experiencias-locales'), 'paddle-board', 'Paddle board', true, false, false, 50),
  ((select id from category_map where slug = 'experiencias-locales'), 'pesca-deportiva', 'Pesca deportiva', true, false, false, 60),
  ((select id from category_map where slug = 'experiencias-locales'), 'golf', 'Golf', true, false, false, 70),
  ((select id from category_map where slug = 'experiencias-locales'), 'restaurantes-locales', 'Restaurantes en Punta de Mita, Sayulita, San Pancho, La Cruz y Bucerías', true, false, false, 80),

  ((select id from category_map where slug = 'wellness'), 'masaje-unidad', 'Masaje en unidad', true, false, false, 10),
  ((select id from category_map where slug = 'wellness'), 'yoga-privado', 'Yoga privado', true, false, false, 20),
  ((select id from category_map where slug = 'wellness'), 'pilates', 'Pilates', true, false, false, 30),
  ((select id from category_map where slug = 'wellness'), 'sound-healing', 'Sound healing', true, false, false, 40),
  ((select id from category_map where slug = 'wellness'), 'entrenador-personal', 'Entrenador personal', true, false, false, 50),

  ((select id from category_map where slug = 'familia-ninos'), 'ninera', 'Niñera', true, false, false, 10),
  ((select id from category_map where slug = 'familia-ninos'), 'cuna', 'Cuna', true, false, false, 20),
  ((select id from category_map where slug = 'familia-ninos'), 'silla-bebe', 'Silla de bebé', true, false, false, 30),
  ((select id from category_map where slug = 'familia-ninos'), 'kids-cinema', 'Kids cinema', true, false, false, 40),
  ((select id from category_map where slug = 'familia-ninos'), 'actividades-ninos', 'Actividades para niños', true, false, false, 50),

  ((select id from category_map where slug = 'mascotas'), 'registro-mascota', 'Registro de mascota', false, false, false, 10),
  ((select id from category_map where slug = 'mascotas'), 'pet-sitter', 'Pet sitter', true, false, false, 20),
  ((select id from category_map where slug = 'mascotas'), 'grooming', 'Grooming', true, false, false, 30),
  ((select id from category_map where slug = 'mascotas'), 'paseo-mascotas', 'Paseo de mascotas', true, false, false, 40),

  ((select id from category_map where slug = 'emergencias'), 'seguridad', 'Seguridad', false, false, true, 10),
  ((select id from category_map where slug = 'emergencias'), 'enfermeria', 'Enfermería', true, false, true, 20),
  ((select id from category_map where slug = 'emergencias'), 'medico-domicilio', 'Médico a domicilio', true, false, true, 30),
  ((select id from category_map where slug = 'emergencias'), 'reporte-incidente', 'Reporte de incidente', false, false, true, 40),
  ((select id from category_map where slug = 'emergencias'), 'contactos-emergencia', 'Contactos de emergencia', false, false, true, 50),

  ((select id from category_map where slug = 'propietarios'), 'property-care', 'Property care', true, true, false, 10),
  ((select id from category_map where slug = 'propietarios'), 'revision-unidad-vacia', 'Revisión de unidad vacía', true, true, false, 20),
  ((select id from category_map where slug = 'propietarios'), 'mantenimiento-preventivo', 'Mantenimiento preventivo', true, true, false, 30),
  ((select id from category_map where slug = 'propietarios'), 'inventario-fotografico', 'Inventario fotográfico', true, true, false, 40),
  ((select id from category_map where slug = 'propietarios'), 'reporte-post-estancia', 'Reporte post-estancia', true, true, false, 50),
  ((select id from category_map where slug = 'propietarios'), 'preparacion-renta', 'Preparación para renta', true, true, false, 60)
on conflict (slug) do update
set category_id = excluded.category_id,
    name_es = excluded.name_es,
    requires_quote = excluded.requires_quote,
    requires_owner_approval = excluded.requires_owner_approval,
    is_urgent_available = excluded.is_urgent_available,
    sort_order = excluded.sort_order;
