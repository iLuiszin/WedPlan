import { NextResponse } from 'next/server';
import { searchProjects } from '@/features/projects/api/search-projects';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get('q') ?? '';

  try {
    const projects = await searchProjects(q);
    return NextResponse.json(projects);
  } catch (e) {
    console.error('Search error', e);
    return NextResponse.json({ message: 'Erro ao buscar projetos' }, { status: 500 });
  }
}
