import { Searchbar } from "@/components/Searchbar";

export function FilterResultsLayout({
  title,
  subtitle,
  searchPlaceholder,
  filters,
  type,
  children
}) {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      
      <div className="mb-8">
        <Searchbar 
          placeholder={searchPlaceholder} 
          filters={filters}
          type={type}
        />
      </div>
      
      <div>{children}</div>
    </div>
  );
}