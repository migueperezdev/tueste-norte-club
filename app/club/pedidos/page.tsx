import Link from "next/link";
import { db } from "../../../src/db";

export const dynamic = "force-dynamic";

export default async function PedidosPage() {
    const listaPedidos = await db.query.pedidos.findMany({
        with: {
            cliente: true,
        },
        orderBy: (tabla, { asc, desc }) => [
            desc(tabla.mes),
            asc(tabla.id),
        ],
    });

    const meses = [...new Set(listaPedidos.map((pedido) => pedido.mes))];

    return (
        <section className="mx-auto max-w-5xl space-y-8 rounded bg-white p-6 text-stone-900">
            <h1 className="text-3xl font-bold">Pedidos del club</h1>

            <p>Consulta los pedidos de cada mes y el estado de sus envíos.</p>

            {listaPedidos.length === 0 ? (
                <p>Sin pedidos por ahora.</p>
            ) : (
                meses.map((mes) => (
                    <section key={mes} className="space-y-4">
                        <h2 className="text-2xl font-semibold">Mes {mes}</h2>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                                <thead className="bg-stone-100">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">
                                            Pedido
                                        </th>
                                        <th scope="col" className="px-4 py-3">
                                            Cliente
                                        </th>
                                        <th scope="col" className="px-4 py-3">
                                            Café
                                        </th>
                                        <th scope="col" className="px-4 py-3">
                                            Estado
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {listaPedidos
                                        .filter((pedido) => pedido.mes === mes)
                                        .map((pedido) => (
                                            <tr key={pedido.id} className="border-b border-stone-200">
                                                <th scope="row" className="px-4 py-3">
                                                    #{pedido.id}
                                                </th>

                                                <td className="px-4 py-3">
                                                    <p>{pedido.cliente.nombre}</p>
                                                    <p className="text-sm text-stone-600">
                                                        {pedido.cliente.email}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-3">{pedido.cafe}</td>

                                                <td className="px-4 py-3 capitalize">
                                                    {pedido.estado}
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                ))
            )}

            <nav aria-label="Enlaces del club" className="flex flex-wrap gap-6">
                <Link href="/club/alta" className="underline">
                    Apuntarme al club
                </Link>

                <Link href="/" className="underline">
                    Volver al inicio
                </Link>
            </nav>
        </section>
    );
}