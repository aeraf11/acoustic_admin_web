import Shell from "@/components/Shell";
import Panel from "@/components/Panel";

export default function OrdersPage() {
  return (
    <Shell title="Orders">
      <Panel>
        <div className="font-semibold">Orders</div>
        <div className="mt-2 text-sm text-zinc-600">
          This scaffold expects orders endpoints. When you’re ready we can add:
          <ul className="list-disc pl-5 mt-2">
            <li>GET /api/orders</li>
            <li>GET /api/orders/{{id}}</li>
            <li>PATCH /api/orders/{{id}}/status</li>
          </ul>
        </div>
      </Panel>
    </Shell>
  );
}
