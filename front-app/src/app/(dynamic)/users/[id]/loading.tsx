import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Loading() {
  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 md:h-24 md:w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40 mt-2" />
        </div>
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="p-4 md:p-6">
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="max-h-[300px] md:max-h-[400px] overflow-auto">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px] md:w-auto">
                        <Skeleton className="h-4 w-20" />
                      </TableHead>
                      <TableHead className="min-w-[120px]">
                        <Skeleton className="h-4 w-20" />
                      </TableHead>
                      <TableHead className="min-w-[120px]">
                        <Skeleton className="h-4 w-20" />
                      </TableHead>
                      <TableHead className="min-w-[100px]">
                        <Skeleton className="h-4 w-20" />
                      </TableHead>
                      <TableHead className="min-w-[120px]">
                        <Skeleton className="h-4 w-20" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }, (_, i) => i).map((index) => (
                      <TableRow key={`schedule-skeleton-${index}`}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-12 rounded" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="p-4 md:p-6">
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                {Array.from({ length: 3 }, (_, i) => i).map((index) => (
                  <div
                    key={`stat-top-${index}`}
                    className="text-center sm:text-left"
                  >
                    <Skeleton className="h-3 w-24 mb-1" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                {Array.from({ length: 3 }, (_, i) => i).map((index) => (
                  <div
                    key={`stat-bottom-${index}`}
                    className="text-center sm:text-left"
                  >
                    <Skeleton className="h-3 w-24 mb-1" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Skeleton className="h-3 w-48" />
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="p-4 md:p-6">
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="max-h-[300px] md:max-h-[350px] overflow-auto">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky top-0 bg-background">
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                      <TableHead className="sticky top-0 bg-background">
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }, (_, i) => i).map((index) => (
                      <TableRow key={`omikuji-row-${index}`}>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="p-4 md:p-6">
            <Skeleton className="h-6 w-56" />
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="max-h-[300px] md:max-h-[400px] overflow-auto">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }, (_, i) => i).map((index) => (
                      <TableRow key={`coinflip-row-${index}`}>
                        <TableCell>
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="p-4 md:p-6">
            <Skeleton className="h-6 w-56" />
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="max-h-[300px] md:max-h-[400px] overflow-auto">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Skeleton className="h-4 w-20" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                      <TableHead>
                        <Skeleton className="h-4 w-16" />
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 5 }, (_, i) => i).map((index) => (
                      <TableRow key={`janken-row-${index}`}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-16" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
