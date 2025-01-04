"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export default function BreadcrumbClient() {
  const pathname = usePathname();
  const pathsAndIds = pathname.split("/").slice(1);
  const paths = pathsAndIds.filter((path) => isNaN(parseInt(path)));

  console.log(paths);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbPage>Dashboard</BreadcrumbPage>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        {paths.map((path, index) => (
          <div key={index} className="flex items-center gap-2">
            <BreadcrumbItem>
              <BreadcrumbLink href={path} className="first-letter:uppercase">
                {path}
              </BreadcrumbLink>
            </BreadcrumbItem>

            {index < paths.length - 1 && (
              <BreadcrumbSeparator className="hidden md:block" />
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
