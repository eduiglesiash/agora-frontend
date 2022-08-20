import './Dashboard.page.css';
import CardInfo from '../../components/CardInfo/CardInfo';


export default function DashboardPage() {
    return (
        <section className="a-p-16">
            <section className="Dashboard__info">
                <CardInfo text="Libros en la biblioteca" 
                    cardType="info"
                    number="5000" />
                <CardInfo text="Libros prestados este año" cardType="success" number="5000" />
                <CardInfo text="Libros prestados actualmente" cardType="warning" number="5000" />
                <CardInfo text="Libros por devolver" cardType="alert" number="5000" />
            </section>
            <section className="Dashboard__card">
                
            </section>
        </section>
    )
}
