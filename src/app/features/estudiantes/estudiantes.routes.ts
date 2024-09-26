const estudiantesRoute = [
    {
        path: '',
        loadComponent: () => import('./lista.estudiantes/lista.estudiantes.component').then(m => m.ListaEstudiantesComponent)
    }
];

export default estudiantesRoute;