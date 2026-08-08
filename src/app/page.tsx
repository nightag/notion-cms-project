import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, Users, DollarSign, ShoppingCart } from "lucide-react";

export default function Home() {
  // 더미 데이터
  const stats = [
    {
      title: "총 사용자",
      value: "2,543",
      description: "지난 달 대비 12% 증가",
      icon: Users,
      change: "+12%",
    },
    {
      title: "매출",
      value: "$45,231.89",
      description: "지난 달 대비 8% 증가",
      icon: DollarSign,
      change: "+8%",
    },
    {
      title: "주문",
      value: "1,234",
      description: "지난 달 대비 23% 증가",
      icon: ShoppingCart,
      change: "+23%",
    },
    {
      title: "성장률",
      value: "18.2%",
      description: "지난 분기 대비 4% 상승",
      icon: TrendingUp,
      change: "+4%",
    },
  ];

  const recentOrders = [
    { id: "ORD001", customer: "홍길동", amount: "$250.00", status: "배송중", date: "2024-08-08" },
    { id: "ORD002", customer: "김영희", amount: "$180.50", status: "완료", date: "2024-08-07" },
    { id: "ORD003", customer: "이순신", amount: "$320.00", status: "대기중", date: "2024-08-07" },
    { id: "ORD004", customer: "박문수", amount: "$95.00", status: "완료", date: "2024-08-06" },
    { id: "ORD005", customer: "이몽룡", amount: "$450.00", status: "배송중", date: "2024-08-06" },
  ];

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "완료":
        return "default";
      case "배송중":
        return "secondary";
      case "대기중":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-8">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Next.js 15 + Tailwind CSS + shadcn/ui 스타터 프로젝트
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </p>
                  <Badge className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950">
                    {stat.change}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 최근 주문 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 주문</CardTitle>
          <CardDescription>
            최근 5개의 주문 내역입니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>주문 ID</TableHead>
                <TableHead>고객명</TableHead>
                <TableHead>금액</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>날짜</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 dark:text-gray-400">
                    {order.date}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
