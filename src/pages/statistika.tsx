import { useEffect } from "react";
import ApexCharts from "apexcharts";
import useGetData from "./hooks/usegetdata";

export default function Statistika() {
  const { data, isPending } = useGetData("products", false);

  useEffect(() => {
    if (!isPending && data.length > 0) {
      // Ma'lumotlarni grafik formatiga o'tkazish
      const cookingTimes = data.map((item) => item.cookingTime);
      const productNames = data.map((item) => item.title || "Unnamed"); // 'title' maydoni mavjudligini taxmin qilish

      // Kategoriyalarni sanash
      const categoriesCount = data.reduce((acc, item) => {
        const category = item.category || "Unknown";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Pie chart uchun etiketlar va seriyalar
      const pieLabels = Object.keys(categoriesCount);
      const pieSeries = Object.values(categoriesCount);

      var pieOptions = {
        series: pieSeries, // Real ma'lumotlar
        chart: {
          width: 380,
          type: "pie",
        },
        labels: pieLabels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      };

      var barOptions = {
        series: [
          {
            data: cookingTimes,
          },
        ],
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: "end",
            horizontal: true,
            dataLabels: {
              position: "top",
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: productNames,
        },
        legend: {
          show: false, // Legendani yashirish
        },
      };

      var pieChart = new ApexCharts(
        document.querySelector("#pieChart"),
        pieOptions
      );
      var barChart = new ApexCharts(
        document.querySelector("#barChart"),
        barOptions
      );

      pieChart.render();
      barChart.render();
      return () => {
        pieChart.destroy();
        barChart.destroy();
      };
    }
  }, [data, isPending]);

  return (
    <div>
      <div>Statistika</div>
      {isPending && (
        <div className="flex items-center justify-center">
          <span
            style={{ zoom: "2" }}
            className="loading loading-bars loading-lg"
          ></span>
        </div>
      )}
      {!isPending && (
        <>
          <div className="container" id="pieChart"></div>
          <div className="container" id="barChart"></div>
        </>
      )}
    </div>
  );
}
