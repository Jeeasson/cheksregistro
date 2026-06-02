'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  FileText,
  CreditCard,
  Camera,
  BookOpen,
  Phone,
  Moon,
  Sun,
  RotateCcw,
  Archive,
  Sparkles,
  Download,
  AlertTriangle,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'

interface Requirement {
  id: number
  title: string
  description: string
  category: 'documento' | 'pago' | 'otro'
  icon: React.ReactNode
  details?: string[]
  highlight?: boolean
}

const requirements: Requirement[] = [
  {
    id: 1,
    title: 'Carta de Solicitud de Inscripción',
    description:
      'Dirigida al Presidente del Colegio Departamental de Arquitectos de Potosí – Arq. Edwin Winston T. Humerez Medrano',
    category: 'documento',
    icon: <FileText className="h-5 w-5" />,
    details: ['Doble ejemplar'],
  },
  {
    id: 2,
    title: 'Título en Provision Nacional',
    description: 'Título profesional en provisión nacional',
    category: 'documento',
    icon: <BookOpen className="h-5 w-5" />,
    details: [
      'Original (se quedará en el CDAP una semana para su verificación)',
      '1 fotocopia legalizada',
      '1 fotocopia simple',
    ],
  },
  {
    id: 3,
    title: 'Diploma Académico',
    description:
      'Otorgado por la Universidad Boliviana o por la Universidad extranjera (debe ser revalidada)',
    category: 'documento',
    icon: <BookOpen className="h-5 w-5" />,
    details: [
      'Original (se quedará en el CAP una semana para su verificación)',
      'Si es de universidad extranjera: revalidada por el Ministerio de Educación, Cultura y Deportes o por la Universidad Boliviana',
      '1 fotocopia legalizada',
      '1 fotocopia simple',
    ],
  },
  {
    id: 4,
    title: 'Cédula de Identidad',
    description: 'Fotocopias de la cédula de identidad personal',
    category: 'documento',
    icon: <FileText className="h-5 w-5" />,
    details: [
      '2 fotocopias simples a colores',
      'Deben ser legibles',
      'Con firma color azul en el medio',
    ],
  },
  {
    id: 5,
    title: 'Acta de Defensa de Tesis y/o Proyecto de Grado',
    description: 'Acta de defensa del trabajo final de grado',
    category: 'documento',
    icon: <BookOpen className="h-5 w-5" />,
    details: ['2 fotocopias simples'],
  },
  {
    id: 6,
    title: 'Fotografía a Color',
    description: 'Fotografía tamaño cuadrado para el registro',
    category: 'otro',
    icon: <Camera className="h-5 w-5" />,
    details: [
      'Tamaño cuadrado, dimensión 300x300 pixeles a 300 DPI',
      'Fondo color blanco',
      'Formato JPG (no PNG ni TIFF)',
      'En traje formal tanto para varones y mujeres',
    ],
    highlight: true,
  },
  {
    id: 7,
    title: 'Depósito Bancario – Colegio de Arquitectos de Bolivia',
    description: 'Bs 1.400,00 al Banco Nacional de Bolivia',
    category: 'pago',
    icon: <CreditCard className="h-5 w-5" />,
    details: [
      'A nombre del Colegio de Arquitectos de Bolivia',
      'Monto: Bs 1.400,00 (Un mil cuatrocientos 00/100)',
      'Cta. Cte. N° 3500389140',
      'BANCO NACIONAL DE BOLIVIA',
    ],
    highlight: true,
  },
  {
    id: 8,
    title: 'Depósito Bancario – CDAP',
    description: 'Bs 700,00 al Banco Mercantil Santa Cruz',
    category: 'pago',
    icon: <CreditCard className="h-5 w-5" />,
    details: [
      'A nombre del Colegio Departamental de Arquitectos de Potosí',
      'Monto: Bs 700,00 (Setecientos 00/100)',
      'Cta. Cte. N° 4011058139',
      'BANCO MERCANTIL SANTA CRUZ',
    ],
    highlight: true,
  },
  {
    id: 9,
    title: 'Comprobantes de Depósitos Bancarios',
    description: 'Originales y fotocopias de los 2 depósitos bancarios',
    category: 'pago',
    icon: <CreditCard className="h-5 w-5" />,
    details: [
      'Originales de los 2 depósitos bancarios',
      '1 fotocopia simple de cada uno',
      'Para acreditar el pago de las sumas correspondientes',
    ],
  },
  {
    id: 10,
    title: 'Pago en Secretaría CDAP – Bs 150,00',
    description: 'Pago en secretaria del Colegio Deptal. de Arquitectos de Potosí',
    category: 'pago',
    icon: <CreditCard className="h-5 w-5" />,
    details: [
      'Monto: Bs 150,00 (Ciento cincuenta 00/100)',
      'Efectuarse en secretaria del Colegio Deptal. de Arquitectos de Potosí',
    ],
  },
  {
    id: 11,
    title: 'Pago en Secretaría CDAP – Bs 236,00',
    description:
      'Por conceptos de acto de juramentos, copia de leyes, reglamento y aranceles',
    category: 'pago',
    icon: <CreditCard className="h-5 w-5" />,
    details: [
      'Monto: Bs 236,00 (Doscientos treinta y seis 00/100)',
      'Efectuarse en la secretaria del Colegio Deptal. de Arquitectos de Potosí',
      'Incluye: acto de juramentos, copia de leyes, reglamento y aranceles',
    ],
  },
  {
    id: 12,
    title: 'Pago en Secretaría CDAP – Bs 20,00',
    description: 'Para los membretes correspondientes',
    category: 'pago',
    icon: <CreditCard className="h-5 w-5" />,
    details: [
      'Monto: Bs 20,00 (Veinte 00/100)',
      'Efectuarse en la secretaria del Colegio Deptal. de Arquitectos de Potosí',
      'Para los membretes correspondientes',
    ],
  },
  {
    id: 13,
    title: 'Memoria del Proyecto de Grado',
    description: 'Memoria del proyecto final de grado',
    category: 'documento',
    icon: <BookOpen className="h-5 w-5" />,
    details: ['Digital en CD', 'Empastado o anillado en físico'],
  },
  {
    id: 14,
    title: 'Curriculum Vitae',
    description: 'Curriculum vitae documentado',
    category: 'documento',
    icon: <FileText className="h-5 w-5" />,
    details: ['1 ejemplar', 'Respaldado', 'En un folder amarillo'],
  },
  {
    id: 15,
    title: 'Consulta y Referencia',
    description: 'Información de contacto para consultas',
    category: 'otro',
    icon: <Phone className="h-5 w-5" />,
    details: ['Cel.: 76166721', 'CDAP'],
  },
]

const STORAGE_KEY = 'cdap-checklist-state'

const categoryLabels = {
  documento: 'Documentos',
  pago: 'Pagos',
  otro: 'Otros',
}

const categoryColors = {
  documento: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  pago: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  otro: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
}

export default function Home() {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>(() => {
    if (typeof window === 'undefined') return {}
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({})
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    const savedTheme = localStorage.getItem('cdap-theme')
    if (savedTheme) return savedTheme === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const { toast } = useToast()

  const hasInitialized = useRef(false)

  useEffect(() => {
    hasInitialized.current = true
  }, [])

  useEffect(() => {
    if (hasInitialized.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checkedItems))
    }
  }, [checkedItems])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('cdap-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  const toggleCheck = useCallback((id: number) => {
    setCheckedItems((prev) => {
      const newState = { ...prev, [id]: !prev[id] }
      const total = requirements.length
      const checked = Object.values(newState).filter(Boolean).length
      if (checked === total) {
        toast({
          title: '¡Felicitaciones!',
          description: 'Has completado todos los requisitos para la matrícula.',
        })
      }
      return newState
    })
  }, [toast])

  const toggleExpand = useCallback((id: number) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const resetAll = useCallback(() => {
    setCheckedItems({})
    setExpandedItems({})
    localStorage.removeItem(STORAGE_KEY)
    toast({
      title: 'Checklist reiniciado',
      description: 'Se han limpiado todos los marcadores de progreso.',
    })
  }, [toast])

  const totalChecked = Object.values(checkedItems).filter(Boolean).length
  const totalRequirements = requirements.length
  const progressPercent = Math.round((totalChecked / totalRequirements) * 100)

  const categoriesGrouped = requirements.reduce(
    (acc, req) => {
      if (!acc[req.category]) acc[req.category] = []
      acc[req.category].push(req)
      return acc
    },
    {} as Record<string, Requirement[]>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-teal-100 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-200 dark:shadow-teal-900/30">
                <Archive className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  Matrícula Permanente
                </h1>
                <p className="text-xs text-teal-600 dark:text-teal-400 font-medium">
                  Colegio de Arquitectos de Potosí
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-full hover:bg-teal-50 dark:hover:bg-gray-800"
              >
                {darkMode ? (
                  <Sun className="h-4 w-4 text-amber-400" />
                ) : (
                  <Moon className="h-4 w-4 text-teal-600" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Section */}
      <div className="sticky top-[65px] z-40 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-teal-50 dark:border-gray-800/50">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Progreso General
            </span>
            <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
              {totalChecked}/{totalRequirements} requisitos
            </span>
          </div>
          <div className="relative">
            <Progress value={progressPercent} className="h-3 bg-teal-100 dark:bg-gray-800" />
            <motion.div
              className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
              initial={false}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <div className="flex gap-3">
              {(Object.keys(categoriesGrouped) as Array<keyof typeof categoryLabels>).map(
                (cat) => {
                  const catItems = categoriesGrouped[cat]
                  const catChecked = catItems.filter((r) => checkedItems[r.id]).length
                  return (
                    <span
                      key={cat}
                      className="text-xs text-muted-foreground flex items-center gap-1"
                    >
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          cat === 'documento'
                            ? 'bg-teal-500'
                            : cat === 'pago'
                              ? 'bg-amber-500'
                              : 'bg-purple-500'
                        }`}
                      />
                      {catChecked}/{catItems.length}
                    </span>
                  )
                }
              )}
            </div>
            <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Alert */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-900/20">
            <CardContent className="p-3 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <span className="font-semibold">Importante:</span> Todos los documentos deben
                entregarse según el orden de esta lista dentro de un archivador.
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Checklist by Category */}
        {(Object.entries(categoriesGrouped) as [string, Requirement[]][]).map(
          ([category, items], catIdx) => (
            <motion.section
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + catIdx * 0.1 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge
                  className={`${categoryColors[category as keyof typeof categoryColors]} text-xs font-semibold px-2.5 py-0.5`}
                >
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {items.filter((r) => checkedItems[r.id]).length}/{items.length} completados
                </span>
              </div>

              <div className="space-y-2">
                {items.map((req, idx) => {
                  const isChecked = checkedItems[req.id] || false
                  const isExpanded = expandedItems[req.id] || false

                  return (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + catIdx * 0.1 + idx * 0.03 }}
                      layout
                    >
                      <Card
                        className={`group transition-all duration-200 cursor-pointer hover:shadow-md ${
                          isChecked
                            ? 'border-teal-300 dark:border-teal-700 bg-teal-50/50 dark:bg-teal-950/20'
                            : 'border-gray-200 dark:border-gray-800 hover:border-teal-200 dark:hover:border-teal-800'
                        } ${req.highlight && !isChecked ? 'ring-1 ring-amber-300 dark:ring-amber-700' : ''}`}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            {/* Checkbox */}
                            <button
                              onClick={() => toggleCheck(req.id)}
                              className="mt-0.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
                              aria-label={`Marcar requisito: ${req.title}`}
                            >
                              <AnimatePresence mode="wait">
                                {isChecked ? (
                                  <motion.div
                                    key="checked"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                  >
                                    <CheckCircle2 className="h-6 w-6 text-teal-500" />
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="unchecked"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                  >
                                    <Circle className="h-6 w-6 text-gray-300 dark:text-gray-600 group-hover:text-teal-400 transition-colors" />
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </button>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-xs font-mono text-muted-foreground w-5 shrink-0">
                                  {req.id}.
                                </span>
                                <h3
                                  className={`text-sm font-semibold leading-snug ${
                                    isChecked
                                      ? 'line-through text-teal-600/70 dark:text-teal-400/70'
                                      : 'text-gray-900 dark:text-white'
                                  }`}
                                >
                                  {req.title}
                                </h3>
                              </div>
                              <p
                                className={`text-xs leading-relaxed pl-7 ${
                                  isChecked
                                    ? 'text-gray-400 dark:text-gray-600 line-through'
                                    : 'text-gray-600 dark:text-gray-400'
                                }`}
                              >
                                {req.description}
                              </p>

                              {/* Expand/Collapse Details */}
                              {req.details && req.details.length > 0 && (
                                <div className="pl-7">
                                  <button
                                    onClick={() => toggleExpand(req.id)}
                                    className="flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 mt-1.5 font-medium transition-colors"
                                  >
                                    {isExpanded ? (
                                      <ChevronUp className="h-3 w-3" />
                                    ) : (
                                      <ChevronDown className="h-3 w-3" />
                                    )}
                                    {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                                  </button>
                                  <AnimatePresence>
                                    {isExpanded && (
                                      <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden mt-2 space-y-1"
                                      >
                                        {req.details.map((detail, dIdx) => (
                                          <li
                                            key={dIdx}
                                            className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400"
                                          >
                                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                                            {detail}
                                          </li>
                                        ))}
                                      </motion.ul>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}
                            </div>

                            {/* Category icon */}
                            <div className="shrink-0 text-muted-foreground/50 group-hover:text-teal-400 transition-colors">
                              {req.icon}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </motion.section>
          )
        )}

        {/* Payment Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-amber-200 dark:border-amber-800/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <CreditCard className="h-4 w-4" />
                Resumen de Pagos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Depósito Colegio de Arquitectos de Bolivia (BNB)
                </span>
                <span className="font-semibold">Bs 1.400,00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Depósito CDAP (Mercantil Santa Cruz)</span>
                <span className="font-semibold">Bs 700,00</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Pago secretaría CDAP</span>
                <span className="font-semibold">Bs 150,00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Juramentos, leyes, reglamento y aranceles
                </span>
                <span className="font-semibold">Bs 236,00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Membretes</span>
                <span className="font-semibold">Bs 20,00</span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm font-bold text-amber-700 dark:text-amber-400">
                <span>TOTAL ESTIMADO</span>
                <span>Bs 2.506,00</span>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Completion Card */}
        {progressPercent === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <Card className="border-teal-300 dark:border-teal-700 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30">
              <CardContent className="p-6 text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2, repeatDelay: 2 }}
                  className="inline-block"
                >
                  <Sparkles className="h-10 w-10 text-teal-500 mx-auto mb-3" />
                </motion.div>
                <h3 className="text-lg font-bold text-teal-700 dark:text-teal-300 mb-1">
                  ¡Todos los requisitos completos!
                </h3>
                <p className="text-sm text-teal-600 dark:text-teal-400">
                  Estás listo para presentar tu documentación en el CDAP. Recuerda organizar todo
                  en un archivador siguiendo el orden de esta lista.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-teal-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            <span>Consultas: 76166721 – CDAP</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reiniciar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Reiniciar checklist?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Se borrarán todos los marcadores de progreso. Esta acción no se puede deshacer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={resetAll}>Reiniciar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </footer>

      {/* PWA Install Prompt */}
      <PWAPrompt />
    </div>
  )
}

function PWAPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null)
        setShowPrompt(false)
      })
    }
  }

  if (!showPrompt) return null

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 left-4 right-4 max-w-md mx-auto z-50"
    >
      <Card className="shadow-xl border-teal-200 dark:border-teal-800 bg-white dark:bg-gray-900">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shrink-0">
            <Download className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Instalar aplicación</p>
            <p className="text-xs text-muted-foreground">
              Accede offline desde tu pantalla de inicio
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setShowPrompt(false)}
            >
              Ahora no
            </Button>
            <Button
              size="sm"
              className="text-xs bg-teal-600 hover:bg-teal-700"
              onClick={handleInstall}
            >
              Instalar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
