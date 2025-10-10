import { ProjectModel, type IProject } from '@/models/project';
import type { CreateProjectInput } from '@/schemas/project-schema';
import { serializeDocument, type SerializedDocument } from '@/types/mongoose-helpers';
import { generateProjectSlug, slugify } from '@/lib/slug';

export async function createProject(
  data: CreateProjectInput
): Promise<SerializedDocument<IProject>> {
  // Ensure slug
  let slug = data.slug?.trim();
  if (!slug) {
    slug = generateProjectSlug(
      data.brideFirstName,
      data.groomFirstName,
      data.weddingDate ?? undefined
    );
  } else {
    slug = slugify(slug);
  }

  // Ensure uniqueness by appending numeric suffix if needed
  let uniqueSlug = slug;
  for (let counter = 1; await ProjectModel.exists({ slug: uniqueSlug }); counter++) {
    uniqueSlug = `${slug}-${counter}`;
  }

  const project = await ProjectModel.create({ ...data, slug: uniqueSlug });
  return serializeDocument(project);
}
