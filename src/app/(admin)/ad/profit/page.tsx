import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  PieChart,
  BarChart3,
  ArrowUpRight,
  Target,
  Wallet,
  Receipt,
  Calculator,
} from 'lucide-react';

export default function ProfitManagementPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profit Management</h1>
        <p className="mt-2 text-gray-600">
          Track revenue, costs, and profitability across the platform
        </p>
      </div>

      {/* Main Financial Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">$847,392</div>
            <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              +18.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Net Profit
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">$234,567</div>
            <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              +22.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Operating Costs
            </CardTitle>
            <Calculator className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">$612,825</div>
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <ArrowUpRight className="h-3 w-3" />
              +5.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Profit Margin
            </CardTitle>
            <Target className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">27.7%</div>
            <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3" />
              +3.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown and Transaction Fees */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Revenue Sources
            </CardTitle>
            <CardDescription>
              Breakdown of platform revenue streams
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Subscription Fees</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold">$456,789</span>
                <p className="text-xs text-gray-500">53.9%</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Transaction Fees</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold">$234,567</span>
                <p className="text-xs text-gray-500">27.7%</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Premium Features</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold">$123,456</span>
                <p className="text-xs text-gray-500">14.6%</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Advertisement</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold">$32,580</span>
                <p className="text-xs text-gray-500">3.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Cost Breakdown
            </CardTitle>
            <CardDescription>Analysis of operating expenses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Infrastructure</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold">$245,130</span>
                <p className="text-xs text-gray-500">40.0%</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Personnel</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold">$214,495</span>
                <p className="text-xs text-gray-500">35.0%</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Marketing</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold">$91,865</span>
                <p className="text-xs text-gray-500">15.0%</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Operations</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold">$61,335</span>
                <p className="text-xs text-gray-500">10.0%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Monthly Growth
            </CardTitle>
            <CardDescription>Revenue growth over time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">This Month</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-bold text-green-600">+18.2%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Month</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-bold text-green-600">+12.5%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">3 Months Ago</span>
              <div className="flex items-center gap-2">
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-sm font-bold text-red-600">-2.1%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Key Performance Indicators
            </CardTitle>
            <CardDescription>Financial health metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ROI</span>
              <span className="text-sm font-bold text-green-600">142.3%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">EBITDA</span>
              <span className="text-sm font-bold text-blue-600">$289,450</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cash Flow</span>
              <span className="text-sm font-bold text-green-600">$156,789</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Burn Rate</span>
              <span className="text-sm font-bold text-orange-600">
                $45,230/mo
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Quarterly Targets
            </CardTitle>
            <CardDescription>Progress towards financial goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Revenue Target</span>
                <span className="font-medium">85% achieved</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: '85%' }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Profit Target</span>
                <span className="font-medium">92% achieved</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-500"
                  style={{ width: '92%' }}
                ></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cost Control</span>
                <span className="font-medium">78% achieved</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-orange-500"
                  style={{ width: '78%' }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
